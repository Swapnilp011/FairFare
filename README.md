# FairFare ✈️

FairFare is an intelligent, AI-powered travel companion designed to help modern travelers explore the world without breaking the bank. It combines smart expense tracking with real-time AI insights to ensure you get the best value for your money.

## 🌟 Features

- **AI-Powered Travel Planning**: Generate personalized travel itineraries based on your budget, interests, and destination using Google Gemini AI.
- **Smart Budget Dashboard**: Visual analytics of your travel budget, real-time spending tracking, and remaining funds.
- **Fair Price Guardrail**: An AI assistant that analyzes your pending purchases (e.g., "Coffee in Paris for €15") and warns you if you are overpaying.
- **Expense Logging**: Quick and easy logging of travel expenses categorized by food, transport, stay, and adventure.
- **Travel History**: Keep a record of all your past and ongoing trips.
- **Premium UI/UX**: faster, responsive, and beautiful interface featuring glassmorphism and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism)
- **Database & Backend**: Google Firebase (Firestore, Authentication)
- **AI Integration**: Google Gemini Pro API (`@google/generative-ai`)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- **Node.js** (v18 or higher) installed. [Download Here](https://nodejs.org/)
- A **Google Cloud Project** with Firebase enabled.
- An **API Key** for Google Gemini AI.

### 1. Clone the Repository

```bash
git clone https://github.com/Swapnilp011/FairFare.git
cd budget-travel-app
```

### 2. Install Dependencies

Install the required npm packages using the command line:

```bash
npm install
```

### 3. Environment Configuration 🔐

This project relies on **Firebase** and **Google Gemini** services. You need to configure your API keys.

1.  Create a new file named `.env` in the root directory of the project.
2.  Copy the following template into your `.env` file:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### � How to get these keys:

**A. Google Gemini API Key:**
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click "Create API key".
3.  Paste the key into `VITE_GEMINI_API_KEY`.

**B. Firebase Configuration:**
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open your project (or create one).
3.  Go to **Project Settings** (Gear icon > Project settings).
4.  Scroll down to the "Your apps" section.
5.  If you haven't created a web app, click the **`</>` (Web)** icon to register one.
6.  You will see a config object (`const firebaseConfig = { ... }`). Copy the values from there into your `.env` file corresponding to the variable names above.

### 4. Run the Application

Start the local development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

---

## 📂 Project Structure

```
src/
├── components/       # React components
│   ├── Analytics/    # Travel history and stats
│   ├── Auth/         # Login/Signup handling
│   ├── Dashboard/    # Main user dashboard
│   ├── TripSetup/    # AI Plan generation flow
│   └── Welcome/      # Landing page
├── config/           # Firebase configuration
├── App.jsx           # Main application entry
└── App.css           # Global styles and design system
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
