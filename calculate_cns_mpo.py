import math
import re
import subprocess

import pandas as pd
from rdkit import Chem
from rdkit.Chem import Crippen, Descriptors


FLOAT_RE = re.compile(r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?")


def _find_column(df, names):
    normalized = {str(column).strip().lower(): column for column in df.columns}
    for name in names:
        column = normalized.get(name.lower())
        if column is not None:
            return column
    return None


def _is_missing(value):
    return value is None or (isinstance(value, float) and math.isnan(value))


def _to_float(value):
    if _is_missing(value):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _run_cxcalc(args):
    try:
        result = subprocess.run(args, capture_output=True, text=True, check=False)
    except OSError:
        return None

    if result.returncode != 0:
        return None
    return result.stdout


def _table_from_cxcalc_output(output):
    lines = [line.strip() for line in output.splitlines() if line.strip()]
    lines = [line for line in lines if not line.lower().startswith(("warning", "error"))]
    if len(lines) < 2:
        return None, None

    header = re.split(r"\t+|\s{2,}", lines[0].strip())
    data = re.split(r"\t+|\s{2,}", lines[1].strip())
    return header, data


def _parse_numeric_column(output, accepted_header_fragments):
    header, data = _table_from_cxcalc_output(output)
    if not header or not data:
        return None

    for index, name in enumerate(header):
        normalized = name.lower()
        if any(fragment in normalized for fragment in accepted_header_fragments):
            if index < len(data):
                value = _to_float(data[index])
                if value is not None:
                    return value

    numeric_values = []
    for token in data[1:]:
        match = FLOAT_RE.fullmatch(token.strip())
        if match:
            numeric_values.append(float(match.group(0)))
    return numeric_values[0] if numeric_values else None


def _parse_basic_pka(output):
    header, data = _table_from_cxcalc_output(output)
    if not header or not data:
        return None

    basic_values = []
    for index, name in enumerate(header):
        normalized = name.lower()
        if ("bpka" in normalized or "basic" in normalized) and index < len(data):
            value = _to_float(data[index])
            if value is not None:
                basic_values.append(value)

    return max(basic_values) if basic_values else None


def _calculate_logd(smiles):
    output = _run_cxcalc(["cxcalc", "logd", "pH=7.4", smiles])
    if output is None:
        raise RuntimeError("LogD calculation failed")

    logd = _parse_numeric_column(output, ("logd",))
    if logd is None:
        raise RuntimeError("LogD calculation failed")
    return logd


def _calculate_basic_pka(smiles):
    output = _run_cxcalc(["cxcalc", "pka", smiles])
    if output is None:
        raise RuntimeError("pKa calculation failed")

    pka = _parse_basic_pka(output)
    if pka is None:
        raise RuntimeError("pKa calculation failed")
    return pka


def _linear_decrease(value, low, high):
    if value <= low:
        return 1.0
    if value > high:
        return 0.0
    return (high - value) / (high - low)


def _score_clogp(value):
    return _linear_decrease(value, 3.0, 5.0)


def _score_clogd(value):
    return _linear_decrease(value, 2.0, 4.0)


def _score_mw(value):
    return _linear_decrease(value, 360.0, 500.0)


def _score_tpsa(value):
    if value <= 20.0:
        return 0.0
    if value <= 40.0:
        return (value - 20.0) / 20.0
    if value <= 90.0:
        return 1.0
    if value <= 120.0:
        return (120.0 - value) / 30.0
    return 0.0


def _score_hbd(value):
    return _linear_decrease(value, 0.5, 3.5)


def _score_pka(value):
    return _linear_decrease(value, 8.0, 10.0)


def _descriptor_value(row, column, fallback):
    value = _to_float(row[column]) if column is not None else None
    return fallback() if value is None else value


def calculate_cns_mpo_dataframe(input_csv_path):
    """
    Returns pandas DataFrame with one column: CNS_MPO
    """
    df = pd.read_csv(input_csv_path)

    smiles_column = _find_column(df, ["SMILES", "smiles"])
    if smiles_column is None:
        raise ValueError("Input CSV must contain a SMILES column")

    mw_column = _find_column(df, ["MW", "MolWt", "MolecularWeight", "Molecular_Weight"])
    tpsa_column = _find_column(df, ["TPSA", "TopoPSA", "TopologicalPolarSurfaceArea"])
    hbd_column = _find_column(df, ["HBD", "nHBDon", "NumHDonors"])
    logp_column = _find_column(df, ["LogP", "ALogP", "XLogP", "MLogP", "CrippenLogP"])

    scores = []
    for _, row in df.iterrows():
        smiles = row[smiles_column]
        if pd.isna(smiles) or not str(smiles).strip():
            raise ValueError("Invalid or missing SMILES")
        smiles = str(smiles).strip()

        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            raise ValueError(f"Invalid SMILES: {smiles}")

        logd = _calculate_logd(smiles)
        pka = _calculate_basic_pka(smiles)

        mw = _descriptor_value(row, mw_column, lambda: Descriptors.MolWt(mol))
        tpsa = _descriptor_value(row, tpsa_column, lambda: Descriptors.TPSA(mol))
        hbd = _descriptor_value(row, hbd_column, lambda: Descriptors.NumHDonors(mol))
        logp = _descriptor_value(row, logp_column, lambda: Crippen.MolLogP(mol))

        cns_mpo = (
            _score_clogp(logp)
            + _score_clogd(logd)
            + _score_mw(mw)
            + _score_tpsa(tpsa)
            + _score_hbd(hbd)
            + _score_pka(pka)
        )
        scores.append(cns_mpo)

    return pd.DataFrame({"CNS_MPO": scores})
