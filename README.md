<div align="center">

# 🧠 ListIQ - Intelligence

**The AI-Powered Amazon Listing Intelligence Platform**

*Turn raw marketplace data into high-converting listings. Analyze SEO gaps, extract buyer sentiment, monitor competitors, and generate execution plans in seconds.*

<a href="https://react.dev"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript_5.8-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
<a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/></a>
<a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/></a>
<a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_4-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/></a>

</div>

---

## 🌟 What is ListIQ - Intelligence?

**ListIQ - Intelligence** is a sophisticated, full-stack SaaS platform designed for Amazon sellers, brands, and shoppers. It takes any standard Amazon URL, bypasses the noise, and delivers a rigorous, data-driven analysis of the product's performance.

Whether you are trying to optimize your own listing to capture more Best Seller Rank (BSR), or you want to uncover the critical flaws in a competitor's product before launching your own, ListIQ provides instant, actionable intelligence.

---

## 🚀 Key Features

### 1. 360° Listing Audit
Stop guessing what's wrong with your listing. ListIQ parses the live Amazon page and provides a comprehensive, algorithmic score based on:
- **Title Optimization & Keyword Density**
- **Bullet Point Quality & Formatting**
- **Image Count & A+ Content Presence**
- **Pricing Competitiveness**
- **Review Sentiment Ratio**

### 2. Dual-Perspective Engine (Seller vs. Buyer Mode)
- **Seller Perspective:** Focuses on revenue simulators, AEO/SEO keyword gaps, ad bidding suggestions, and prioritized, step-by-step conversion fix plans.
- **Buyer Perspective:** Evaluates product trustworthiness, highlights genuine flaws extracted from reviews, and summarizes the true value of the product.

### 3. Voice of the Customer (Review Intelligence)
Why read hundreds of reviews when AI can do it instantly? ListIQ isolates the **Pain Points** (from 1-2★ reviews) and **What's Working** (from 4-5★ reviews) so you know exactly what customers love and hate about a product.

### 4. Competitor Spy Module
Instantly compare the analyzed ASIN against its top three rivals in the marketplace. See side-by-side matrices of pricing, review velocity, and feature gaps to identify exactly where competitors are vulnerable.

### 5. Deterministic Smart Fallback
API credits exhausted? Captchas blocking the scraper? ListIQ features a robust, deterministic local fallback engine that hashes the ASIN to generate fully realistic, varied mock data. The dashboard stays alive, interactive, and beautifully populated no matter the backend status.

---

## 🛠️ Architecture & Tech Stack

ListIQ - Intelligence is built with modern, high-performance tooling to ensure a smooth, premium user experience.

### Frontend
- **React 19 & TypeScript**: Concurrent rendering and end-to-end type safety.
- **Vite & TanStack Router**: Lightning-fast compilation and file-based routing.
- **Tailwind CSS v4 & Framer Motion**: Responsive, glassmorphic UI components with fluid, interactive micro-animations.
- **Lucide React & Recharts**: Crisp iconography and dynamic sentiment/score charting.

### Backend
- **Node.js & Express 5**: Robust, asynchronous REST API architecture.
- **Rainforest API Integration**: For live, high-fidelity Amazon marketplace scraping.
- **OpenAI Integration**: For processing unstructured review text into structured JSON intelligence.
- **CORS & Helmet**: Security middleware for cross-origin protection.

---

## 💻 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Git**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Anjali15-rawat/ListIQ--Intelligence-.git
   cd ListIQ--Intelligence-
   ```

2. **Install Dependencies**
   Run the following commands to install dependencies for both the frontend and backend:
   ```bash
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

3. **Configure Environment Variables**
   
   *In `backend/.env`:*
   ```env
   PORT=5000
   # Optional: Include your API keys for live data and AI parsing.
   # If omitted, the deterministic local engine will still run the app flawlessly.
   RAINFOREST_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ```

   *In `frontend/.env`:*
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

ListIQ - Intelligence is designed to run the frontend and backend concurrently.

**For Windows Users:**
Simply double-click the `start.bat` file in the root directory.

**Using NPM:**
```bash
# From the root directory, this starts both the Vite server and Express API
npm run dev
```

- The **Frontend Dashboard** will be live at `http://localhost:5173`
- The **Backend API** will be listening at `http://localhost:5000`

## 🚀 Deployment

### Backend (Deploy to Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add **Environment Variables**:
   - `PORT`: `10000` (or leave default)
   - `RAINFOREST_API_KEY`: Your key
   - `OPENAI_API_KEY`: Your key
5. Once deployed, copy your **service URL** (e.g., `https://listiq-backend.onrender.com`).

### Frontend (Deploy to Netlify)
1. Go to [Netlify](https://app.netlify.com).
2. Click **Add new site** -> **Import from GitHub**.
3. Select your repository and set:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist/client`
4. Add **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://listiq-backend.onrender.com/api`)
5. Deploy!

---

## 🤝 Contributing

Contributions are always welcome! If you have suggestions to improve the intelligence engine or the UI, please feel free to fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.
