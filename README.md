# 🧠 BrainRoute Database (brainroutedb)

![BrainRoute Banner](https://img.shields.io/badge/BrainRoute-Database-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A sophisticated **Molecular Intelligence Platform** for exploring Blood-Brain Barrier (BBB) permeable molecules with AI-powered predictions and comprehensive molecular data visualization. Now powered by **Neon PostgreSQL** for secure, scalable data storage.

🔗 **Live Database:** [https://omicscodeathon.github.io/brainroutedb](https://omicscodeathon.github.io/brainroutedb)

## 🔗 **BrainRoute Platform:**:[BrainRoute on HuggingFace](https://huggingface.co/spaces/Nnobody/brainroute)

## 📖 About BrainRoute

**BrainRoute Database** is part of the BrainRoute Platform ecosystem, designed to facilitate drug discovery and neuroscience research by providing:

- 🔬 **Comprehensive molecular database** with BBB permeability predictions
- 🧪 **Interactive 2D structure visualization** powered by RDKit
- 📊 **Real-time data synchronization** with Neon PostgreSQL
- 🤖 **AI-powered predictions** with confidence and uncertainty metrics
- 🔍 **Advanced search capabilities** by name, SMILES, ID, or formula
- 📈 **Detailed molecular properties** including physicochemical parameters
- 🔒 **Secure architecture** with isolated backend API

### What is the Blood-Brain Barrier (BBB)?

The Blood-Brain Barrier is a selective permeability barrier that protects the brain from harmful substances while allowing essential nutrients to pass through. Understanding which molecules can cross the BBB is crucial for:

- 💊 Central Nervous System (CNS) drug development
- 🧬 Neurological disease treatment
- 🔬 Brain-targeted therapeutic research

---

## Features

### Core Functionality

- **Smart Search Engine**: Find molecules by name, SMILES notation, molecular formula, or unique identifier
- **Molecular Structure Visualization**: View interactive 2D chemical structures rendered with RDKit
- **BBB Prediction**: AI-powered predictions (BBB+ or BBB-) with confidence scores
- **Comprehensive Properties**: Access detailed molecular data including:
  - Molecular weight and formula
  - LogP (lipophilicity)
  - Hydrogen bond donors/acceptors
  - Topological Polar Surface Area (TPSA)
  - Rotatable bonds and heavy atoms

### Technical Features

- **Real-time Sync**: Automatic synchronization with Neon database every 30 seconds
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Fast Navigation**: Client-side routing with React Router
- **Production Ready**: Optimized build for deployment
- **Secure Backend**: Database credentials never exposed to frontend
- **REST API**: Express.js API with security headers

---

## Architecture

- **Frontend**: React with Tailwind CSS (port 3000)
- **Backend**: Express.js REST API (port 5000)
- **Database**: Neon PostgreSQL (Serverless Postgres)
- **Security**: Helmet, CORS, SSL/TLS encryption

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Neon PostgreSQL account** - [Sign up here](https://neon.tech/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/omicscodeathon/brainroutedb.git
cd brainroutedb
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the project root:

```env
# Neon Database Configuration (Backend only - NEVER expose to frontend)
DATABASE_URL= Connection String( looks like: 'postgresql://username:password@host/database?sslmode=require&channel_binding=require')

# API Configuration
REACT_APP_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Port for backend server
PORT=5000
```

4. **Set up the database**

- Create a Neon PostgreSQL database
- Run the schema from `server/schema.sql` in Neon SQL Editor
- Import your molecule data

5. **Run the application**

```bash
# Development (runs frontend + backend together)
npm run dev

# Or run separately:
npm run server  # Backend on port 5000
npm start       # Frontend on port 3000
```

---

## 📚 Documentation

For detailed setup instructions, API documentation, database schema, and deployment guide, see [SETUP.md](./SETUP.md).

---

## 📡 API Endpoints

- `GET /api/health` - Health check
- `GET /api/molecules` - Fetch all molecules from database
- `GET /api/molecules/:id` - Fetch single molecule by ID

---

## 🚀 Deployment

### 1. Backend Deployment (Render)

The backend must be hosted publicly to be accessible by the live frontend.

1.  Push code to GitHub.
2.  Create a new **Web Service** on [Render](https://render.com/).
3.  Connect your repository.
4.  Set **Build Command**: `npm install`
5.  Set **Start Command**: `node server/index.js`
6.  Add Environment Variables in Render Dashboard:
    - `DATABASE_URL`: Your Neon connection string
    - `SERVER_PORT`: `5000`
7.  Copy your new backend URL (e.g., `https://brainroutedb-api.onrender.com`).

### 2. Frontend Deployment (GitHub Pages)

1.  Update your local `.env` file with the live backend URL:
    ```env
    REACT_APP_API_URL=https://your-backend-app.onrender.com
    ```
2.  Deploy the frontend:
    ```bash
    npm run deploy
    ```
    This command builds the app and pushes it to the `gh-pages` branch.

---

## 🛠️ Built With

- **[React](https://reactjs.org/)** (v19.2.0) - UI framework
- **[React Router](https://reactrouter.com/)** (v7.9.4) - Client-side routing
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.3.0) - Styling
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[RDKit](https://www.rdkit.org/)** - Chemical structure visualization
- **[Express.js](https://expressjs.com/)** - Backend API framework
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless database
- **[Helmet](https://helmetjs.github.io/)** - Security middleware
- **[node-postgres (pg)](https://node-postgres.com/)** - PostgreSQL client

---

## 🔒 Security

- **Database Isolation**: Database credentials never exposed to frontend
- **API Authentication**: Backend API acts as secure intermediary
- **SSL/TLS**: All database connections encrypted
- **CORS Protection**: Restricted to allowed origins only
- **Security Headers**: Helmet middleware for Express
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
