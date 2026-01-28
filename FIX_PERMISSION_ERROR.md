# How to Fix "Permission Denied" Error

The error "Permission Denied" means that the Firebase Firestore Security Rules in the cloud do not allow you to save the trip. This usually happens because the rules haven't been deployed or are set to "deny all" by default.

## Solution 1: Update Rules in Firebase Console (Easiest)

1.  Open the **Firebase Console** (https://console.firebase.google.com/).
2.  Select your project.
3.  Go to **Firestore Database** in the left menu.
4.  Click on the **Rules** tab.
5.  Copy the code below and paste it into the Rules editor, replacing what is there:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if the user is accessing their own data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Rules for 'users' collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Rules for 'trips' collection
    match /trips/{tripId} {
      // Allow create if user is logged in and userId matches
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      // Allow read/update/delete if user owns the trip
      allow read, update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      
      match /expenses/{expenseId} {
        allow read, write: if isAuthenticated();
      }
    }
    
    // Default: Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6.  Click **Publish**.

## Solution 2: Deploy using Firebase CLI

If you have Firebase CLI installed:

1.  Open a terminal in your project folder.
2.  Login: `firebase login`
3.  Initialize Firestore: `firebase init firestore`
4.  Deploy: `firebase deploy --only firestore:rules`
