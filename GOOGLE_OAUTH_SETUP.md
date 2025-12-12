# Google OAuth Setup Guide for Solina AI

## Overview
This guide will help you set up Google OAuth authentication for Solina AI.

## Steps to Get Google OAuth Credentials

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (if needed)
- Click on the project dropdown at the top
- Click "NEW PROJECT"
- Name it "Solina AI" or your preferred name
- Click "CREATE"

### 3. Enable Google+ API
- In the left sidebar, go to "APIs & Services" > "Library"
- Search for "Google+ API" or "Google Identity"
- Click on it and click "ENABLE"

### 4. Create OAuth Credentials
- Go to "APIs & Services" > "Credentials"
- Click "CREATE CREDENTIALS" > "OAuth client ID"
- If prompted, configure the OAuth consent screen first:
  - Choose "External" user type
  - Fill in required fields:
    - App name: Solina AI
    - User support email: your email
    - Developer contact: your email
  - Click "SAVE AND CONTINUE"
  - Skip scopes for now (click "SAVE AND CONTINUE")
  - Add test users if needed
  - Click "SAVE AND CONTINUE"

### 5. Configure OAuth Client ID
- Application type: "Web application"
- Name: "Solina AI Web Client"
- Authorized JavaScript origins:
  - http://localhost:3000
  - http://localhost:5173
- Authorized redirect URIs:
  - http://localhost:3000
  - http://localhost:3000/login
- Click "CREATE"

### 6. Copy Your Credentials
You'll see a modal with:
- **Client ID** (looks like: xxxxx-xxxxx.apps.googleusercontent.com)
- **Client Secret** (looks like: GOCSPX-xxxxx)

**Important:** Copy both of these values!

## Configuration

### Backend Configuration
Open `backend/.env` and update:
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
```

### Frontend Configuration
Open `frontend/.env` and update:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Note:** Use the SAME Client ID for both backend and frontend.

## Testing

### 1. Restart Backend Server
```bash
cd backend
npm run dev
```

### 2. Restart Frontend Server
```bash
cd frontend
npm run dev
```

### 3. Test Google Login
- Go to http://localhost:3000/login
- Click the "Sign in with Google" button
- Choose your Google account
- You should be redirected to the dashboard

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure you added http://localhost:3000 to "Authorized JavaScript origins"
- Make sure you added http://localhost:3000/login to "Authorized redirect URIs"
- Wait a few minutes for changes to propagate

### "idpiframe_initialization_failed" Error
- Make sure cookies are enabled in your browser
- Clear your browser cache and cookies
- Try in an incognito/private window

### "Invalid Google token" Error
- Verify GOOGLE_CLIENT_ID matches in both backend/.env and frontend/.env
- Restart both servers after updating .env files

## Production Setup

When deploying to production:

1. Add production URLs to Google Console:
   - Authorized JavaScript origins: https://yourdomain.com
   - Authorized redirect URIs: https://yourdomain.com/login

2. Update .env files with production URLs:
   - Backend: Update FRONTEND_URL
   - Frontend: Update VITE_API_URL

3. Consider moving to "In production" in OAuth consent screen settings

## Security Notes

- Never commit .env files to git (already in .gitignore)
- Keep Client Secret secure (backend only)
- Only Client ID is exposed to frontend
- Token verification happens on backend for security

## Need Help?

- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- Google Cloud Console: https://console.cloud.google.com/
