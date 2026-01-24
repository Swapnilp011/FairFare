# FairFare System Architecture Documentation

This document explicitly defines the software architecture, technology stack, and data design of the FairFare application.

## 1. High-Level Architecture Diagram
The application follows a **Serverless Client-Side MVC** pattern. The React frontend handles all logic, data fetching, and routing, communicating directly with Firebase (Data/Auth) and Google Gemini (AI).

```mermaid
graph TD
    subgraph Client [Client Side "Browser"]
        UI[React UI Components]
        Logic[App Logic & State]
        Cache[LocalStorage "Offline Backup"]
    end

    subgraph Backend [Serverless Backend "Firebase"]
        Auth[Firebase Authentication]
        DB[(Cloud Firestore)]
    end

    subgraph External [External Services]
        AI[Google Gemini API]
    end

    %% Interactions
    UI <--> Logic
    Logic <--> |Auth Tokens| Auth
    Logic <--> |R/W JSON Data| DB
    Logic <--> |Sync/Backup| Cache
    Logic --> |Prompt Request| AI
    AI --> |JSON Recommendation| Logic
```

## 2. Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** (Vite) | Main UI library for component-based architecture. |
| **Language** | **JavaScript (ES6+)** | Core logic implementation. |
| **Styling** | **CSS3 (Custom)** | CSS Variables, Flexbox/Grid, Glassmorphism effects. |
| **Database** | **Firestore (NoSQL)** | Real-time cloud database for storing trips and expenses. |
| **Authentication** | **Firebase Auth** | Google Sign-In and Email/Password management. |
| **AI Integration** | **Google Gemini Flash** | LLM for generating travel plans and price checking. |
| **Build Tool** | **Vite** | Fast development server and bundler. |

## 3. Component Architecture

*   **`App.jsx`**: The "Controller".
    *   Manages Global State: `currentTrip`, `user`, `view`.
    *   Handles Routing: Switches between `<Welcome />`, `<Auth />`, `<TripSetup />`, and `<Dashboard />`.
    *   Manages Authentication Listeners.
*   **`Dashboard.jsx`**: The "Main View".
    *   **State**: `expenses`, `totalBudget`, `tripPlan`.
    *   **Sub-Components**: Stats Cards, AI Plan Tabs, Expense Form, Activity List.
    *   **Responsibility**: Real-time listeners (`onSnapshot`) for expenses, calculating totals.
*   **`TripSetup.jsx`**: The "Wizard".
    *   **Responsibility**: Collects inputs -> Calls Gemini API -> Formats JSON -> Saves to Firestore.

## 4. Data Model (Schema)

The database is NoSQL (Firestore).

### Collection: `trips`
Stores metadata and the AI plan for a specific trip.
*   **Document ID**: `tripId` (Auto-generated)
*   **Fields**:
    *   `userId`: string (Link to Auth UID)
    *   `location`: string ("Goa")
    *   `budget`: number (5000)
    *   `createdAt`: timestamp
    *   `recommendations`: object (The AI JSON output)
        *   `food`: array
        *   `places`: array
        *   `stays`: array

### Sub-Collection: `expenses`
Path: `trips/{tripId}/expenses`
*   **Document ID**: `expenseId` (Auto-generated)
*   **Fields**:
    *   `name`: string ("Taxi")
    *   `cost`: number (500)
    *   `city`: string ("Goa")
    *   `timestamp`: timestamp

## 5. Security Architecture
*   **Authentication**: Users must be logged in via Google/Email to access any write features.
*   **Authorization**:
    *   RLS (Row Level Security) via Firestore Rules (Mocked as "Test Mode" for Hackathon, typically `request.auth.uid == resource.data.userId`).
*   **API Security**:
    *   Gemini API Key is stored in environment variables (`.env`).
    *   Client-side calls are protected by obscure variables (Vite pattern).

---
*Generated for FairFare Project Documentation*
