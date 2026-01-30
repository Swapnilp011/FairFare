# Implementation Plan - Auto Close Profile Dropdown

## Problem
The user reported that the profile dropdown menu in the top right corner would not close when clicking outside of it. It would only close when clicking the profile button again.

## Solution
Implement a "click outside" behavior using `useRef` and `useEffect` in the `App.jsx` component.

## Changes
1.  **Modified `src/App.jsx`**:
    -   Imported `useRef` from 'react'.
    -   Created a `userWidgetRef` using `useRef(null)`.
    -   Attached the `ref` to the `.user-widget` container div.
    -   Added a `useEffect` hook to listen to global `mousedown` events when the menu is open (`showUserMenu` is true).
    -   Inside the event handler, checked if the click target is outside the `userWidgetRef`.
    -   If outside, updated the state `setShowUserMenu(false)` to close the menu.
    -   Cleaned up the event listener on component unmount or when `showUserMenu` changes.

## Verification
-   The code has been updated to include the necessary logic.
-   The functionality should now work as expected: clicking anywhere adjacent to the profile menu will close it.
