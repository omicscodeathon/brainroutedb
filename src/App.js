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
  Atom,
  RefreshCw,
  Download,
} from "lucide-react";

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
  handleDownloadCsv,
}) => (
  <div className="max-w-5xl mx-auto text-center py-8">
    {isLoading && (
      <div className="fixed top-20 right-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="font-medium">Syncing with Neon Database...</span>
      </div>
    )}
    <div className="flex items-center justify-center mb-4">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
        <Brain className="w-20 h-20 text-white" />
      </div>
    </div>
    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
      BrainRoute Database
    </h1>
    <p className="text-2xl text-gray-600 mb-4">
      Molecular Intelligence Platform
    </p>
    <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
      Explore BBB-permeable molecules with AI-powered predictions and
      comprehensive molecular data
    </p>

    <div className="max-w-3xl mx-auto mb-16">
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          placeholder="Search by molecule name, SMILES, or ID..."
          className="w-full px-8 py-5 text-lg border-2 border-blue-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 pr-16 shadow-md transition"
        />
        <button
          onClick={handleSearchClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-full border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition text-sm font-semibold"
        >
          <Download className="w-4 h-4" />
          Download Full Database (CSV)
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition hover:shadow-xl">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
          <Database className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">
          Comprehensive Database
        </h3>
        <p className="text-gray-600">
          Access detailed molecular information and therapeutic properties
        </p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-indigo-100 hover:border-indigo-300 transition hover:shadow-xl">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
          <Search className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Search</h3>
        <p className="text-gray-600">
          Advanced search by name, SMILES notation, or unique identifiers
        </p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition hover:shadow-xl">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
          <Network className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">
          Structure Visualization
        </h3>
        <p className="text-gray-600">
          Interactive molecular structures with detailed property analysis
        </p>
      </div>
    </div>

    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <FlaskConical className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
        <p className="text-2xl font-bold text-blue-600">{molecules.length}+</p>
        <p className="text-sm text-gray-600">Molecules</p>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <Activity className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
        <p className="text-2xl font-bold text-indigo-600">Real-time</p>
        <p className="text-sm text-gray-600">Updates</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <Atom className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
        <p className="text-2xl font-bold text-purple-600">Advanced</p>
        <p className="text-sm text-gray-600">Analytics</p>
      </div>
      <div className="bg-gradient-to-br from-pink-50 to-blue-50 p-6 rounded-xl border border-pink-200">
        <Brain className="w-8 h-8 text-pink-600 mb-2 mx-auto" />
        <p className="text-2xl font-bold text-pink-600">AI-Powered</p>
        <p className="text-sm text-gray-600">Predictions</p>
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
  <div>
    <div className="mb-8">
      <div className="max-w-4xl">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search by molecule name, SMILES, or ID..."
            className="w-full px-8 py-4 text-lg border-2 border-blue-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 pr-16 shadow-md"
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-800">
        Search Results
        <span className="text-lg font-normal text-blue-600 ml-3 bg-blue-50 px-4 py-1 rounded-full">
          {filteredMolecules.length} molecules found
        </span>
      </h2>
      <button
        onClick={handleDownloadCsv}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>

    {filteredMolecules.length === 0 ? (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-16 text-center border-2 border-blue-100">
        <Search className="w-20 h-20 text-blue-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">
          No molecules found
        </h3>
        <p className="text-gray-500 text-lg">
          Try a different search term or browse all molecules
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4">
        {filteredMolecules.map((molecule) => (
          <div
            key={molecule.id}
            onClick={() => viewMoleculeDetail(molecule)}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer border border-blue-100 hover:border-blue-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <div className="flex-shrink-0">
                  <MoleculeStructure smiles={molecule.smiles} size="small" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {molecule.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-mono bg-blue-50 inline-block px-2 py-1 rounded mb-2">
                    {molecule.id}
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 font-semibold">
                        Formula
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {molecule.formula}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-2 rounded-lg border border-indigo-100">
                      <p className="text-xs text-indigo-600 font-semibold">
                        Weight
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {molecule.weight} g/mol
                      </p>
                    </div>
                    <div
                      className={`bg-gradient-to-br p-2 rounded-lg border ${
                        molecule.prediction === "BBB+"
                          ? "from-green-50 to-emerald-50 border-green-200"
                          : "from-red-50 to-rose-50 border-red-200"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold ${
                          molecule.prediction === "BBB+"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Prediction
                      </p>
                      <p
                        className={`font-bold text-sm ${
                          molecule.prediction === "BBB+"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {molecule.prediction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-blue-400 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const MoleculeDetail = ({ molecules }) => {
  const { moleculeId } = useParams();
  const navigate = useNavigate();
  const selectedMolecule = molecules.find((mol) => mol.id === moleculeId);

  if (!selectedMolecule) {
    return (
      <div className="text-center p-16">
        <h2 className="text-2xl font-bold">Molecule not found</h2>
        <button
          onClick={() => navigate("/search")}
          className="mt-4 text-blue-600"
        >
          Go back to search
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/search")}
        className="mb-8 text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold text-lg bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition"
      >
        <ChevronRight className="w-5 h-5 transform rotate-180" />
        Back to results
      </button>

      <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-blue-100">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            {selectedMolecule.name}
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-xl text-blue-600 font-mono bg-blue-50 inline-block px-4 py-2 rounded-full">
              {selectedMolecule.id}
            </p>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                selectedMolecule.prediction === "BBB+"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedMolecule.prediction} • {selectedMolecule.confidence}%
              confidence
            </span>
            {/* <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                selectedMolecule.uncertainty < 50
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedMolecule.uncertainty.toFixed(2)}% uncertainty
            </span> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Network className="w-6 h-6 text-blue-600" />
              2D Structure
            </h2>
            <MoleculeStructure smiles={selectedMolecule.smiles} size="large" />
            <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 font-semibold mb-2">
                SMILES Notation
              </p>
              <p className="font-mono text-xs text-gray-900 break-all">
                {selectedMolecule.smiles}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              Molecular Properties
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  Molecular Weight
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.weight} g/mol
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                <p className="text-sm text-indigo-600 font-semibold mb-2">
                  LogP
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.logP}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                <p className="text-sm text-purple-600 font-semibold mb-2">
                  H-Bond Donors
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.hbd}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-red-50 p-4 rounded-xl border-2 border-pink-200">
                <p className="text-sm text-pink-600 font-semibold mb-2">
                  H-Bond Acceptors
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.hba}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-600 font-semibold mb-2">
                  TPSA
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.tpsa} Ų
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
                <p className="text-sm text-yellow-600 font-semibold mb-2">
                  Rotatable Bonds
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.rotatable_bonds}
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border-2 border-cyan-200">
                <p className="text-sm text-cyan-600 font-semibold mb-2">
                  Heavy Atoms
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedMolecule.heavy_atoms}
                </p>
              </div>
            </div>

            {/* <div className="mt-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Physical Properties
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold">
                    Melting Point
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedMolecule.properties.meltingPoint}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold">
                    Boiling Point
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedMolecule.properties.boilingPoint}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold">
                    Solubility
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedMolecule.properties.solubility}
                  </p>
                </div>
              </div>
            </div> */}
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
  const navigate = useNavigate();

  // Filter molecules when search input changes
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredMolecules(molecules);
    } else {
      const query = searchInput.toLowerCase();
      const filtered = molecules.filter(
        (mol) =>
          mol.name.toLowerCase().includes(query) ||
          mol.smiles.toLowerCase().includes(query) ||
          mol.id.includes(query) ||
          mol.formula.toLowerCase().includes(query),
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl group-hover:scale-105 transition">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BrainRoute-DB
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/search"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow">
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
                handleDownloadCsv={handleDownloadCsv}
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
            element={<MoleculeDetail molecules={molecules} />}
          />
        </Routes>
      </main>

      <footer className="bg-white border-t-2 border-blue-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p className="font-medium">
              © 2025 BrainRoute-DB | by BrainRoute team. All rights reserved.
            </p>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium">
                Integrated with{" "}
                <a href="https://huggingface.co/spaces/Nnobody/brainroute">
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
