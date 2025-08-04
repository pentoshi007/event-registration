# 🔥 Firebase Setup Guide

This guide will help you set up Firebase for push notifications in your event registration app.

## 📋 Prerequisites

1. A Google account
2. Node.js and npm installed
3. The project running locally

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter your project name (e.g., "event-registration-app")
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## 🔧 Step 2: Configure Web App

1. In your Firebase project, click **"Add app"** → **Web**
2. Enter app nickname (e.g., "Event Registration Client")
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. Copy the Firebase config object (you'll need this later)

## 🔔 Step 3: Enable Cloud Messaging

1. In Firebase Console, go to **"Project settings"** (gear icon)
2. Go to **"Cloud Messaging"** tab
3. Under **"Web configuration"**, generate a **Web push certificate** (VAPID key)
4. Copy the **Key pair** (this is your VAPID key)

## 🔐 Step 4: Generate Service Account

1. In Firebase Console, go to **"Project settings"** → **"Service accounts"**
2. Click **"Generate new private key"**
3. Download the JSON file (keep it secure!)

## ⚙️ Step 5: Configure Environment Variables

### Client Configuration (.env)

Create `/client/.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_from_config
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_from_config
VITE_FIREBASE_APP_ID=your_app_id_from_config
VITE_FIREBASE_VAPID_KEY=your_vapid_key_from_step3
```

### Server Configuration (.env)

Create `/server/.env` with your service account details:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventregdb
JWT_SECRET=your_random_jwt_secret

# Firebase Admin Configuration (from downloaded JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=private_key_id_from_json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\npaste_private_key_here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=client_id_from_json

CLIENT_URL=http://localhost:5173
```

## 📝 Step 6: Update Service Worker

Update `/client/public/firebase-messaging-sw.js` with your Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "your_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id",
});
```

## 🧪 Step 7: Test Notifications

1. Start both client and server:

   ```bash
   # Terminal 1 - Client
   cd client && npm run dev

   # Terminal 2 - Server
   cd server && npm run dev
   ```

2. Open the app in your browser: `http://localhost:5173`

3. Look for the notification permission prompt and click **"Allow"**

4. Register/login to the app

5. Register for an event - you should receive a notification!

## 🔍 Troubleshooting

### Common Issues:

1. **"process is not defined"** ✅ Fixed - using `import.meta.env`

2. **Permission denied**: Make sure to allow notifications in browser

3. **No token generated**: Check console for errors, verify VAPID key

4. **Service worker not loading**: Ensure SW file is in `/public` folder

5. **Admin SDK errors**: Verify service account JSON details

### Testing Notifications:

You can test notifications using the admin API endpoints:

```bash
# Send notification to all users
curl -X POST http://localhost:5000/api/notifications/send-to-all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"title":"Test","body":"Hello World!"}'
```

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Service Worker Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🎯 Next Steps

Once notifications are working:

1. Customize notification appearance
2. Add notification actions (buttons)
3. Implement notification history
4. Add notification preferences
5. Set up automated event reminders

Happy coding! 🚀
