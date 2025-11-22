# Database for Predicting Blood-Brain Barrier-Permeable mTOR Inhibitors for Alzheimer’s Disease Using Machine Learning
=======
# 🧠 BrainRoute Database

![BrainRoute Banner](https://img.shields.io/badge/BrainRoute-Database-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A sophisticated **Molecular Intelligence Platform** for exploring Blood-Brain Barrier (BBB) permeable molecules with AI-powered predictions and comprehensive molecular data visualization.

🔗 **Live Database:** [https://omicscodeathon.github.io/brainroutedb](https://omicscodeathon.github.io/brainroutedb)

## 🔗 **BrainRoute Platform:**:[BrainRoute on HuggingFace](https://huggingface.co/spaces/Nnobody/brainroute)

## 📖 About BrainRoute

**BrainRoute Database** is part of the BrainRoute Platform ecosystem, designed to facilitate drug discovery and neuroscience research by providing:

- 🔬 **Comprehensive molecular database** with BBB permeability predictions
- 🧪 **Interactive 2D structure visualization** powered by RDKit
- 📊 **Real-time data synchronization** with Google Sheets
- 🤖 **AI-powered predictions** with confidence and uncertainty metrics
- 🔍 **Advanced search capabilities** by name, SMILES, ID, or formula
- 📈 **Detailed molecular properties** including physicochemical parameters

### What is the Blood-Brain Barrier (BBB)?

The Blood-Brain Barrier is a selective permeability barrier that protects the brain from harmful substances while allowing essential nutrients to pass through. Understanding which molecules can cross the BBB is crucial for:

- 💊 Central Nervous System (CNS) drug development
- 🧬 Neurological disease treatment
- 🔬 Brain-targeted therapeutic research

---

## ✨ Features

### 🎯 Core Functionality

- **Smart Search Engine**: Find molecules by name, SMILES notation, molecular formula, or unique identifier
- **Molecular Structure Visualization**: View interactive 2D chemical structures rendered with RDKit
- **BBB Prediction**: AI-powered predictions (BBB+ or BBB-) with confidence scores
- **Comprehensive Properties**: Access detailed molecular data including:
  - Molecular weight and formula
  - LogP (lipophilicity)
  - Hydrogen bond donors/acceptors
  - Topological Polar Surface Area (TPSA)
  - Rotatable bonds and heavy atoms
  - Physical properties (melting point, boiling point, solubility)

### 🚀 Technical Features

- **Real-time Sync**: Automatic synchronization with Google Sheets every 30 seconds
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Fast Navigation**: Client-side routing with React Router
- **Production Ready**: Optimized build for GitHub Pages deployment

---

## 🎬 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/omicscodeathon/brainroutedb.git
cd brainroute-db
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the project root:

```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
REACT_APP_GOOGLE_SHEET_ID=your_google_sheet_id
REACT_APP_GOOGLE_SHEET_RANGE=your_sheet_range
```

**How to get a Google Sheets API key:**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable the Google Sheets API
- Create credentials (API Key)
- Restrict the key to your domain and Google Sheets API only

4. **Start the development server**

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

### Deploy to GitHub Pages

1. **Update `package.json`** with your repository information:

```json
{
  "homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME"
}
```

2. **Build and deploy**

```bash
npm run deploy
```

3. **Configure GitHub Pages**
   - Go to your repository → Settings → Pages
   - Source: Select `gh-pages` branch and `/ (root)` folder
   - Save and wait 2-3 minutes

Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME`

---

## 📊 Google Sheets Data Structure

The app expects a Google Sheet with the following column structure:

| Column Index | Data Type | Description                           |
| ------------ | --------- | ------------------------------------- |
| 1            | String    | Molecule Name                         |
| 2            | String    | SMILES Notation                       |
| 9            | Number    | Molecular Weight                      |
| 86           | Number    | TPSA (Topological Polar Surface Area) |
| 109          | Number    | Heavy Atoms Count                     |
| 121          | Number    | H-Bond Acceptors                      |
| 122          | Number    | H-Bond Donors                         |
| 125          | Number    | Rotatable Bonds                       |
| 133          | Number    | LogP                                  |
| 220          | String    | BBB Prediction (BBB+ or BBB-)         |
| 221          | Number    | Confidence (%)                        |
| 222          | Number    | Uncertainty (%)                       |

---

## 🛠️ Built With

- **[React](https://reactjs.org/)** (v19.2.0) - UI framework
- **[React Router](https://reactrouter.com/)** (v7.9.4) - Client-side routing
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.3.0) - Styling
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[RDKit](https://www.rdkit.org/)** - Chemical structure visualization
- **[Google Sheets API](https://developers.google.com/sheets/api)** - Data source

---

## 🔒 Security

- **API Key Protection**: Never commit `.env` files. Always use environment variables.
- **API Restrictions**: Restrict your Google Sheets API key to:
  - Specific domains (your GitHub Pages URL)
  - Google Sheets API only
- **Sheet Permissions**: Keep your Google Sheet private or read-only public

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **BrainRoute Team** - For the AI prediction platform
- **RDKit** - For chemical structure visualization
- **Google Sheets API** - For real-time data integration
- **Create React App** - For the initial project setup

---

## 📧 Contact & Support

- **Platform**: [BrainRoute on HuggingFace](https://huggingface.co/spaces/Nnobody/NeuroGate)
- **Issues**: [GitHub Issues](https://github.com/omicscodeathon/brainroutedb/issues)
- **Website**: [BrainRoute Database](https://omicscodeathon.github.io/brainroutedb)

---

## 🔮 Future Roadmap

- [ ] Add 3D molecular structure visualization
- [ ] Implement molecule similarity search
- [ ] Add export functionality (CSV, JSON)
- [ ] User authentication for personalized collections
- [ ] Advanced filtering and sorting options
- [ ] Molecular descriptor calculator
- [ ] Integration with PubChem and ChEMBL databases
- [ ] Batch analysis capabilities

---

## 📊 Stats

![GitHub Stars](https://img.shields.io/github/stars/omicscodeathon/brainroutedb?style=social)
![GitHub Forks](https://img.shields.io/github/forks/omicscodeathon/brainroutedb?style=social)
![GitHub Issues](https://img.shields.io/github/issues/omicscodeathon/brainroutedb)

---

<div align="center">

**Made with ❤️ by the BrainRoute Team**

[⬆ Back to Top](#-brainroute-database)

</div>
