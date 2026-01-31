# FairFare ✈️

> **Explore the world without breaking the bank.**
> FairFare is your intelligent, AI-powered travel budget companion.

FairFare combines smart expense tracking with real-time AI insights to ensure you get the best value for your money. Whether you are planning a solo adventure or a family vacation, FairFare helps you stay on budget and discover hidden gems.

---

## 📖 For Users: User Guide

Welcome to FairFare! Here is how you can use the app to make your travels smarter and more affordable.

### 1. **Plan Your Trip with AI** 🤖
Don't know where to start?
*   Navigate to the **Plan** section.
*   Enter your **Destination**, **Budget**, **Days**, and number of **Travelers**.
*   Our Gemini-powered AI will generate a personalized itinerary for you, suggesting **Places to Visit**, **Local Food**, and **Stays** that fit your budget.

### 2. **Track Your Budget in Real-Time** 📊
*   Use the **Dashboard** to see your total budget versus your current spending.
*   A visual progress bar shows you exactly how much money you have left.
*   We'll alert you if you're getting close to your limit!

### 3. **The "Fair Price" Guardrail** 🛡️
Ever wondered if you are overpaying for a souvenir or taxi ride?
*   Go to **Log Expense**.
*   Enter the item name and cost.
*   Click **"Check Fair Price"**.
*   The AI checks local rates and tells you if the price is **Fair**, **Cheap**, or **Expensive**. It guards you against tourist traps!

### 4. **Log Expenses on the Go** 📝
*   Quickly add expenses under categories like *Food*, *Transport*, *Stay*, and *Adventure*.
*   Your history is saved automatically so you can review it later.

---

## 💻 For Developers: Developer Guide

If you want to run this project locally, contribute, or fork it, follow the steps below.

### 🛠️ Tech Stack
*   **Frontend**: React.js 19 (Vite)
*   **Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism, Mobile-First)
*   **Backend / DB**: Firebase v9 (Firestore, Authentication)
*   **AI Engine**: Google Gemini Pro API (`@google/generative-ai`)

### 📂 Project Structure

```bash
src/
├── assets/           # Static assets (images, icons)
├── components/       # Functional React components
│   ├── Analytics/    # Spending history and stats
│   ├── Auth/         # Authentication forms
│   ├── Dashboard/    # Main budget overview & expense logging
│   ├── TripSetup/    # AI Trip Planner form & result display
│   └── Welcome/      # Landing/Welcome screen
├── config/           # Firebase configuration file
├── App.jsx           # Main routing and layout logic
├── App.css           # Global styles and variables
├── index.css         # CSS Reset and base styles
└── main.jsx          # React DOM entry point
```

### 🚀 Local Setup & Installation

**Prerequisites:**
*   Node.js (v18+)
*   Google Cloud Project (for Firebase)
*   Google AI Studio Account (for Gemini API)

#### 1. Clone the Repo
```bash
git clone https://github.com/Swapnilp011/FairFare.git
cd budget-travel-app
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your keys:

```env
# Google Gemini API Key (Get from https://aistudio.google.com/)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Get from Project Settings in Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 📜 Available Scripts

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the production-ready app in `dist/`.
*   `npm run preview`: Previews the production build locally.
*   `npm run lint`: Runs ESLint to check for code issues.

### ☁️ Deployment

This project is optimized for deployment on **Vercel** or **Firebase Hosting**.

**Deploying to Vercel:**
1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the Environment Variables in the Vercel dashboard.
4.  Click Deploy.

---

## 🤝 Contributing
Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
