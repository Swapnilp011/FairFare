# FairFare UI Wireframes & Mockup Documentation

This document describes the visual layout and structure (Wireframes) of the FairFare application screens.

## 1. Screen Flow Overview
The application consists of 4 main views managed by the core logical router in `App.jsx`:
1.  **Welcome / Landing**
2.  **Authentication (Auth)**
3.  **Trip Setup (Plan Journey)**
4.  **Dashboard (Main Logic)**

---

## 2. Low-Fidelity Wireframes

### A. Welcome Screen
**Goal**: Engage user and prompt action.
```text
+------------------------------------------------------+
| [Logo: FairFare]          [Nav: Login | Get Started] |
+------------------------------------------------------+
|                                                      |
|          [ Hero Image / Abstract Travel Art ]        |
|                                                      |
|           Never Overpay While Traveling Again        |
|      AI-powered budgeting & itinerary for tourists   |
|                                                      |
|                [ BUTTON: Get Started ]               |
|                                                      |
+------------------------------------------------------+
|   [Feature 1]       [Feature 2]       [Feature 3]    |
|   Real-time Track    AI Guardrails     Smart Plans   |
+------------------------------------------------------+
```

### B. Trip Setup Screen (Form)
**Goal**: Collect data for the AI to generate a plan.
```text
+------------------------------------------------------+
|  < Back (If existing user)                           |
+------------------------------------------------------+
|                 Plan Your Adventure                  |
|    Tell us about your trip to get AI suggestions     |
+------------------------------------------------------+
|                                                      |
|  [ Label: Destination ]                              |
|  [ Input: e.g. "Pariss" ]                            |
|                                                      |
|  [ Label: Purpose ]      [ Label: Duration ]         |
|  [ Dropdown: Leisure ]   [ Input: 3 Days ]           |
|                                                      |
|  [ Label: Total Budget ]                             |
|  [ Input: 5000 ]                                     |
|                                                      |
|          [ BUTTON: Generate & Start Trip ]           |
|             (Shows Spinner when loading)             |
|                                                      |
+------------------------------------------------------+
```

### C. Dashboard (Main Interface)
**Goal**: Central hub for tracking expenses and viewing the plan.
**Layout**: Sidebar + Main Content Area.

```text
+----------------+---------------------------------------------------+
|  FairFare      |  Welcome back, Swapnil!            [User Widget]  |
|                |  (Date Display)                    (Avatar/Logout)|
|  [#] Dashboard |                                                   |
|  [=] Wallet    +---------------------------------------------------+
|  [^] Analytics |                                                   |
|                |  [ ALERT OVERLAY (Hidden/Conditional) ]           |
|                |  [ ! Warning: Price is too high!    ]           |
|  My Trips:     |  [ [Cancel] [Proceed]               ]           |
|  - Goa         |                                                   |
|  - London      +---------------------------------------------------+
|                |                                                   |
|  [+ New Plan]  |  [ STAT CARD ]   [ STAT CARD ]    [ STAT CARD ]   |
|                |  [ Total Budg]   [ Total Spen]    [ Remaining ]   |
|                |  [ ₹ 5000    ]   [ ₹ 1200    ]    [ ₹ 3800    ]   |
|                |                                                   |
+----------------+---------------------------------------------------+
|                |  [ AI TRAVEL PLAN SECTION ]                       |
|                |  [ Tabs: (Places) (Food) (Stays) ]                |
|                |  +---------------------------------------------+  |
|                |  | [Card 1]      [Card 2]       [Card 3]       |  |
|                |  | Name: Taj     Name: Red Fort Name: Market   |  |
|                |  | cost: 500     cost: 200      cost: Free     |  |
|                |  | Rating: 4.5   Rating: 4.2    Rating: 4.8    |  |
|                |  +---------------------------------------------+  |
|                |                                                   |
|                |  +-------------------+  +----------------------+  |
|                |  | Budget Health     |  | Recent Activity      |  |
|                |  | [===========---]  |  | - Taxi (₹500)        |  |
|                |  | 76% Used          |  | - Lunch (₹200)       |  |
|                |  +-------------------+  | - Museum (₹500)      |  |
|                |  | Add Expense       |  |                      |  |
|                |  | [ Name      ]     |  |                      |  |
|                |  | [ Cost      ]     |  |                      |  |
|                |  | [ BUTTON    ]     |  |                      |  |
|                |  +-------------------+  +----------------------+  |
+----------------+---------------------------------------------------+
```

---

## 3. Mockup Description (UI Elements)

*   **Color Palette**:
    *   **Primary**: Violet/Purple (`#8B5CF6`) - Used for active states, primary buttons, and branding.
    *   **Background**: Soft Gradients (Glassmorphism effect) - Light grays and whites.
    *   **Alerts**: Red (`#ef4444`)/Yellow for budget warnings.
*   **Typography**: `Inter` or System Sans-Serif. Clean, modern, legible.
*   **Interactions**:
    *   **Hover**: Cards lift (`translateY`), buttons brighten.
    *   **Transitions**: Smooth fade-ins when switching tabs or loading pages.
    *   **Responsive**: Sidebar collapses to top bar or hamburger menu on Mobile (<768px).

---
*Generated for FairFare Project Documentation*
