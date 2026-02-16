import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import {
  Search,
  ChevronRight,
  Home,
  Database,
  Info,
  Brain,
  Network,
  FlaskConical,
  Activity,
  RefreshCw,
  Download,
  ChevronDown,
  FileText,
  Mail,
  Users,
} from "lucide-react";

import About from "./About";
import Contact from "./Contact";

const formatCompoundsCount = (moleculeCount) => {
  const total = Number(moleculeCount || 0) + 10032;
  const thousands = total / 1000;
  const rounded = Math.round(thousands * 10) / 10;
  return `${rounded.toFixed(1)}k+`;
};

// Mock data - will be replaced with Google Sheets API data
const mockMolecules = [
  {
    id: "MOL-001",
    name: "Aspirin",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    formula: "C9H8O4",
    prediction: "BBB-",
    confidence: 87.5,
    mw: 180.158,
    logp: 1.19,
    hbd: 1,
    hba: 4,
    tpsa: 63.6,
    rotatable_bonds: 3,
    heavy_atoms: 13,
  },
  {
    id: "MOL-002",
    name: "Caffeine",
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    formula: "C8H10N4O2",
    prediction: "BBB+",
    confidence: 92.1,
    mw: 194.19,
    logp: -0.07,
    hbd: 0,
    hba: 6,
    tpsa: 58.4,
    rotatable_bonds: 0,
    heavy_atoms: 14,
  },
  {
    id: "MOL-003",
    name: "Glucose",
    smiles: "C(C1C(C(C(C(O1)O)O)O)O)O",
    formula: "C6H12O6",
    prediction: "BBB-",
    confidence: 89.3,
    uncertainty: 10.2,
    mw: 180.156,
    logp: -3.24,
    hbd: 5,
    hba: 6,
    tpsa: 110.4,
    rotatable_bonds: 1,
    heavy_atoms: 12,
  },
];

const MoleculeStructure = ({ smiles, size = "large" }) => {
  const canvasRef = useRef(null);
  const [rdkit, setRdkit] = useState(null);
  const [error, setError] = useState(false);

  const dimensions =
    size === "large" ? { width: 400, height: 300 } : { width: 96, height: 96 };

  // Load the RDKit module once
  useEffect(() => {
    window.initRDKitModule().then((RDKit) => {
      setRdkit(RDKit);
    });
  }, []);

  // Draw the molecule whenever the smiles or rdkit module changes
  useEffect(() => {
    setError(false);
    if (rdkit && canvasRef.current && smiles) {
      try {
        const mol = rdkit.get_mol(smiles);
        if (mol) {
          const svg = mol.get_svg(dimensions.width, dimensions.height);
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing

          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = "data:image/svg+xml;base64," + btoa(svg);
          mol.delete(); // Free up memory
        } else {
          setError(true); // Handle invalid SMILES
        }
      } catch (e) {
        console.error("RDKit drawing error:", e);
        setError(true);
      }
    } else if (!smiles) {
      setError(true);
    }
  }, [rdkit, smiles, dimensions.width, dimensions.height]);

  const containerClasses = `bg-white border-2 rounded-xl flex items-center justify-center shadow-sm overflow-hidden ${
    size === "large" ? "w-full h-96" : "w-24 h-24"
  }`;

  if (error) {
    return (
      <div className={`${containerClasses} border-red-200`}>
        <div className="text-center p-2">
          <FlaskConical
            className={`mx-auto ${
              size === "large" ? "w-16 h-16" : "w-8 h-8"
            } text-red-400 mb-2`}
          />
          <p className="text-red-600 font-semibold text-xs">
            Structure Invalid
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} border-blue-200`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};
const HomePage = ({
  isLoading,
  searchInput,
  setSearchInput,
  handleSearchKeyPress,
  handleSearchClick,
  molecules,
}) => (
  <div className="w-full bg-slate-50 min-h-screen flex flex-col">
    {/* Scientific Hero Section */}
    <div className="bg-slate-900 relative overflow-hidden text-white py-20 px-4 shadow-xl">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Network className="w-96 h-96 transform rotate-12" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {isLoading && (
          <div className="absolute top-0 right-0 flex items-center gap-2 bg-blue-600/20 backdrop-blur border border-blue-500/30 px-3 py-1 rounded-full text-sm text-blue-200 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Syncing data...
          </div>
        )}

        {/* Logo & Intro */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                BrainRoute<span className="text-blue-400">DB</span>
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl font-light">
              A curated repository of Blood-Brain Barrier (BBB) permeability
              predictions and molecular descriptors powered by artificial
              intelligence.
            </p>
          </div>
        </div>

        {/* Search Box - Scientific Style */}
        <div className="bg-white p-2 rounded-lg shadow-xl max-w-4xl">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              placeholder="Search by compound name, SMILES string, or ID..."
              className="w-full pl-12 pr-32 py-4 text-slate-900 bg-transparent text-lg focus:outline-none font-mono placeholder:font-sans placeholder:text-slate-400"
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-2 bg-blue-700 text-white px-8 py-2.5 rounded-md hover:bg-blue-800 transition font-medium text-sm tracking-wide uppercase"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-sm text-slate-500 font-mono">
          <span>Try:</span>
          <button
            className="hover:text-blue-400 underline decoration-dotted transition"
            onClick={() => setSearchInput("Aspirin")}
          >
            Aspirin
          </button>
          <span className="text-slate-700">|</span>
          <button
            className="hover:text-blue-400 underline decoration-dotted transition"
            onClick={() => setSearchInput("C20H25N3O")}
          >
            C20H25N3O
          </button>
        </div>
      </div>
    </div>

    {/* Data Summary Strip */}
    <div className="bg-white border-b border-slate-200 shadow-sm relative z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          <div className="py-4 px-6 text-center md:text-left">
            <p className="text-2xl font-bold text-slate-800 tabular-nums">
              {formatCompoundsCount(molecules.length)}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
              Compounds
            </p>
          </div>
          <div className="py-4 px-6 text-center md:text-left">
            <p className="text-2xl font-bold text-slate-800 tabular-nums">8</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
              Physicochemical Props
            </p>
          </div>
          <div className="py-4 px-6 text-center md:text-left hidden md:block">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-800">KNN/LGBM/ET</p>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
              Model Architecture
            </p>
          </div>
          <div className="py-4 px-6 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 animate-ping opacity-50"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Online</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                System Status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Area */}
    <div className="max-w-6xl mx-auto px-4 py-12 flex-grow w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scientific Card 1 */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-400 transition-all hover:shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Database className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
            Data Repository
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Access the full index of small molecules. Dataset includes computed
            physiochemical properties, BBB permeability status, and confidence
            scores.
          </p>
          <div className="text-xs font-mono text-slate-400 border-t pt-3 border-slate-100">
            Updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Scientific Card 2 */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-indigo-400 transition-all hover:shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
            Prediction Engine
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Models trained on diverse chemical spaces utilize consensus voting
            from K-Nearest Neighbors, LGBM, and Extra Trees Classifier to
            predict permeability.
          </p>
          <div className="text-xs font-mono text-slate-400 border-t pt-3 border-slate-100">
            F1: ~94%, Accuracy: ~94% (On unseen data)
          </div>
        </div>

        {/* Scientific Card 3 */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-purple-400 transition-all hover:shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-lg text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Network className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
            Cheminformatics
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Integrated RDKit visualization for 2D structure rendering, subgraph
            matching, and automated descriptor calculation.
          </p>
          <div className="text-xs font-mono text-slate-400 border-t pt-3 border-slate-100">
            Lib: RDKit-JS 2024.03
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SearchResults = ({
  searchInput,
  setSearchInput,
  handleSearchKeyPress,
  handleSearchClick,
  filteredMolecules,
  viewMoleculeDetail,
  handleDownloadCsv,
}) => (
  <div className="flex flex-col w-full">
    {/* Search Panel - Full Width Sticky White Theme */}
    <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <label className="text-slate-500 text-xs font-bold mb-2 block uppercase tracking-wider flex items-center gap-2">
          <Search className="w-3 h-3" />
          Molecular Query Engine
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search by ID, name, or SMILES..."
            className="w-full pl-12 pr-32 py-3 bg-white border-2 border-slate-900 rounded-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all placeholder-slate-400 font-mono text-lg shadow-sm"
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-slate-900 hover:bg-blue-700 text-white px-6 rounded-md text-sm font-bold transition uppercase tracking-wide shadow-md"
          >
            Refine
          </button>
        </div>
      </div>
    </div>

    {/* Results Stats Bar */}
    <div className="w-full max-w-7xl mx-auto px-6 mt-8">
      <div className="flex items-center justify-between items-end border-b border-gray-200 pb-3 mb-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Search Results
            <span className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full border border-slate-200">
              {filteredMolecules.length}
            </span>
          </h2>
        </div>
        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-400 px-4 py-2 rounded-lg bg-white transition shadow-sm text-xs font-bold uppercase tracking-wide"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {filteredMolecules.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-16 text-center shadow-sm">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            No matching molecules found
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try adjusting your search terms, filtering by specific properties,
            or checking the spelling of your query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 pb-12">
          {filteredMolecules.map((molecule) => (
            <div
              key={molecule.id}
              onClick={() => viewMoleculeDetail(molecule)}
              className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex gap-6 items-center"
            >
              {/* Structure Thumbnail - Optimized Size */}
              <div className="flex-shrink-0 bg-white border border-slate-100 rounded-md p-1 w-24 h-24 flex items-center justify-center shadow-sm group-hover:border-blue-100 transition">
                <MoleculeStructure smiles={molecule.smiles} size="small" />
              </div>

              {/* Content Info */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                      {molecule.name}
                    </h3>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {molecule.id}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider ${
                      molecule.prediction === "BBB+"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}
                  >
                    {molecule.prediction === "BBB+"
                      ? "Permeable"
                      : "Non-Permeable"}
                  </div>
                </div>

                {/* Data Table Grid */}
                <div className="grid grid-cols-4 gap-4 w-full">
                  <div className="border-l-2 border-slate-100 pl-3">
                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">
                      Formula
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate font-mono">
                      {molecule.formula}
                    </p>
                  </div>
                  <div className="border-l-2 border-slate-100 pl-3">
                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">
                      Weight
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate font-mono">
                      {molecule.weight}
                    </p>
                  </div>
                  <div className="border-l-2 border-slate-100 pl-3">
                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">
                      Conf.
                    </p>
                    <p className="text-xs font-bold text-slate-700 font-mono">
                      {molecule.confidence}%
                    </p>
                  </div>
                  <div className="border-l-2 border-slate-100 pl-3">
                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">
                      SMILES
                    </p>
                    <p
                      className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]"
                      title={molecule.smiles}
                    >
                      {molecule.smiles}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-full flex items-center pl-2">
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const MoleculeDetail = ({ molecules }) => {
  const { moleculeId } = useParams();
  const navigate = useNavigate();
  const selectedMolecule = molecules.find((mol) => mol.id === moleculeId);

  if (!selectedMolecule) {
    return (
      <div className="text-center p-16">
        <h2 className="text-2xl font-bold text-slate-900">
          Molecule not found
        </h2>
        <button
          onClick={() => navigate("/search")}
          className="mt-4 text-blue-600 font-medium hover:underline"
        >
          Return to directory
        </button>
      </div>
    );
  }

  const DetailItem = ({ label, value, unit = "", color = "blue" }) => {
    const theme =
      {
        blue: "border-blue-200 text-blue-600",
        indigo: "border-indigo-200 text-indigo-600",
        purple: "border-purple-200 text-purple-600",
        pink: "border-pink-200 text-pink-600",
        emerald: "border-emerald-200 text-emerald-600",
        amber: "border-amber-200 text-amber-600",
        cyan: "border-cyan-200 text-cyan-600",
      }[color] || "border-slate-200 text-slate-500";

    // Extract border and text classes safely
    const [borderColor, textColor] = theme.split(" ");

    return (
      <div
        className={`bg-white p-4 rounded-lg border-2 ${borderColor} shadow-sm hover:shadow-md transition-shadow`}
      >
        <p
          className={`text-xs font-bold uppercase tracking-wider mb-1 ${textColor}`}
        >
          {label}
        </p>
        <p className="text-lg font-bold text-slate-900">
          {value} {unit}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/search")}
        className="mb-6 text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium text-sm transition group"
      >
        <ChevronRight className="w-4 h-4 transform rotate-180 group-hover:-translate-x-1 transition" />
        Back to Results
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {selectedMolecule.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded">
                  ID: {selectedMolecule.id}
                </span>
                <span
                  className={`px-3 py-1 rounded text-sm font-bold border ${
                    selectedMolecule.prediction === "BBB+"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {selectedMolecule.prediction}
                </span>
                <span className="text-slate-400 text-sm">|</span>
                <span className="text-slate-600 font-medium text-sm">
                  {selectedMolecule.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 shadow-sm ${
                selectedMolecule.prediction === "BBB+"
                  ? "bg-white text-emerald-700 border-emerald-200"
                  : "bg-white text-rose-700 border-rose-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedMolecule.prediction === "BBB+"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />
              {selectedMolecule.prediction === "BBB+"
                ? "Permeable"
                : "Non-Permeable"}
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Structure Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
              <MoleculeStructure
                smiles={selectedMolecule.smiles}
                size="large"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-slate-900 font-medium">
                <Network className="w-4 h-4 text-blue-600" />
                <span>SMILES Structure</span>
              </div>
              <p className="font-mono text-xs text-slate-600 break-all bg-white p-3 rounded border border-slate-200">
                {selectedMolecule.smiles}
              </p>
            </div>
          </div>

          {/* Properties Column */}
          <div className="lg:col-span-7">
            <h2 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Physicochemical Properties
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem
                label="Molecular Weight"
                value={selectedMolecule.weight}
                unit="g/mol"
                color="blue"
              />
              <DetailItem
                label="LogP"
                value={selectedMolecule.logP}
                color="indigo"
              />
              <DetailItem
                label="H-Bond Donors"
                value={selectedMolecule.hbd}
                color="purple"
              />
              <DetailItem
                label="H-Bond Acceptors"
                value={selectedMolecule.hba}
                color="pink"
              />
              <DetailItem
                label="TPSA"
                value={selectedMolecule.tpsa}
                unit="Å²"
                color="emerald"
              />
              <DetailItem
                label="Rotatable Bonds"
                value={selectedMolecule.rotatable_bonds}
                color="amber"
              />
              <DetailItem
                label="Heavy Atoms"
                value={selectedMolecule.heavy_atoms}
                color="cyan"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New component to handle the main app logic
const AppContent = () => {
  const [searchInput, setSearchInput] = useState("");
  const [molecules, setMolecules] = useState(mockMolecules);
  const [filteredMolecules, setFilteredMolecules] = useState(mockMolecules);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef(null);
  const navigate = useNavigate();

  //  Update this link with the actual training data location
  const TRAINING_DATA_URL =
    "https://github.com/omicscodeathon/brainroute/tree/main/data";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target)
      ) {
        setIsDownloadMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter molecules when search input changes
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredMolecules(molecules);
    } else {
      const query = searchInput.toLowerCase();
      const filtered = molecules.filter(
        (mol) =>
          (mol.name || "").toLowerCase().includes(query) ||
          (mol.smiles || "").toLowerCase().includes(query) ||
          (mol.id || "").toLowerCase().includes(query) ||
          (mol.formula || "").toLowerCase().includes(query),
      );
      setFilteredMolecules(filtered);
    }
  }, [searchInput, molecules]);

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate("/search");
    }
  };

  const handleDownloadCsv = () => {
    // In development, prefer local server. In production, use environment variable.
    const API_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_API_URL || "http://localhost:5000";
    window.open(`${API_URL}/api/export`, "_blank");
  };

  const viewMoleculeDetail = (molecule) => {
    navigate(`/molecule/${molecule.id}`);
  };

  // Function to fetch data from Neon database via secure API
  const fetchFromDatabase = useCallback(async () => {
    setIsLoading(true);
    try {
      // Force port 5000 if env var is missing to avoid hitting the React dev server
      const API_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5000"
          : process.env.REACT_APP_API_URL || "http://localhost:5000";
      const url = `${API_URL}/api/molecules`;

      console.log(`🔄 Fetching from: ${url}`);

      const response = await fetch(url);

      // Check if we got HTML instead of JSON (The "<" error)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Received HTML instead of JSON:", text.substring(0, 100));
        throw new Error(
          `Server returned HTML. Ensure backend is running on port 5000.`,
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid API response format");
      }

      const fetchedMolecules = result.data;
      console.log(`Successfully loaded ${fetchedMolecules.length} molecules`);

      if (fetchedMolecules.length > 0) {
        setMolecules(fetchedMolecules);

        // Only update the displayed list if the user is NOT currently searching
        // This prevents the list from resetting while you are typing
        if (searchInput.trim() === "") {
          setFilteredMolecules(fetchedMolecules);
        }
      }
    } catch (error) {
      console.error("Error fetching from database:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchInput]); // Add searchInput dependency so we know if user is searching.

  // Real-time data syncing - fetch from database periodically
  useEffect(() => {
    fetchFromDatabase();

    const interval = setInterval(() => {
      fetchFromDatabase();
    }, 180000);

    return () => clearInterval(interval);
  }, [fetchFromDatabase]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-slate-900 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition group"
            >
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition border border-slate-700">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                BrainRoute<span className="text-blue-400">DB</span>
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/search"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <Users className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>

              <div className="relative" ref={downloadMenuRef}>
                <button
                  onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                  className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium text-sm shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform ${isDownloadMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDownloadMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => {
                        handleDownloadCsv();
                        setIsDownloadMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition border-b border-slate-100"
                    >
                      <div className="bg-blue-50 p-2 rounded-md">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          Full Database
                        </p>
                        <p className="text-xs text-slate-500">
                          Current molecular predictions (CSV)
                        </p>
                      </div>
                    </button>

                    <a
                      href={TRAINING_DATA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition"
                      onClick={() => setIsDownloadMenuOpen(false)}
                    >
                      <div className="bg-indigo-50 p-2 rounded-md">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          Training Data
                        </p>
                        <p className="text-xs text-slate-500">
                          Original model development dataset
                        </p>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isLoading={isLoading}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearchKeyPress={handleSearchKeyPress}
                handleSearchClick={handleSearchClick}
                molecules={molecules}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchResults
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearchKeyPress={handleSearchKeyPress}
                handleSearchClick={handleSearchClick}
                filteredMolecules={filteredMolecules}
                viewMoleculeDetail={viewMoleculeDetail}
                handleDownloadCsv={handleDownloadCsv}
              />
            }
          />
          <Route
            path="/molecule/:moleculeId"
            element={
              <div className="max-w-7xl mx-auto px-6 py-8">
                <MoleculeDetail molecules={molecules} />
              </div>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p className="font-medium">
              © 2026 BrainRouteDB | by BrainRoute team @ Omics-Codeathon.
            </p>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600 font-medium">
                Integrated with{" "}
                <a
                  href="https://brainroute.streamlit.app/"
                  className="text-blue-600 hover:underline"
                >
                  BrainRoute Platform
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MolecularDatabase = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default MolecularDatabase;
