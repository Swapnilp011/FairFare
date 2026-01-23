# How to Get Your Firebase Configuration Keys

You need the **Client SDK Configuration** (safe for public use), not the Service Account (private server use).

1.  **Go to the Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Select your project**: Click on `budget-travel`.
3.  **Open Project Settings**:
    *   Click the ⚙️ **Gear Icon** next to "Project Overview" in the top-left sidebar.
    *   Select **Project settings**.
4.  **Scroll to "Your apps"**:
    *   Scroll down to the bottom of the "General" tab.
    *   You should see a section called "Your apps".
5.  **Select or Create Web App**:
    *   If you see an app listing, select it and look for "SDK Setup and Configuration". Select "Config".
    *   If you *don't* see an app, click the **`</>` (Web)** icon.
    *   Give it a nickname (e.g., "FairFare Web").
    *   Click **Register app**.
6.  **Copy the Config**:
    *   You will see a code block starting with `const firebaseConfig = { ... };`.
    *   Copy the values inside the quotes for each field.

## Values to Copy to `.env`:

*   `apiKey` -> `VITE_FIREBASE_API_KEY`
*   `authDomain` -> `VITE_FIREBASE_AUTH_DOMAIN`
*   `projectId` -> `VITE_FIREBASE_PROJECT_ID`
*   `storageBucket` -> `VITE_FIREBASE_STORAGE_BUCKET`
*   `messagingSenderId` -> `VITE_FIREBASE_MESSAGING_SENDER_ID`
*   `appId` -> `VITE_FIREBASE_APP_ID`

> [!NOTE]
> Also remember to get your **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey) and add it to `VITE_GEMINI_API_KEY`.
