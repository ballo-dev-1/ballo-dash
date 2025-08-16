# Facebook Integration Setup

## Integration Setup Required

To use the Facebook token expiry fetching feature, you need to add your Facebook app credentials when creating an integration:

1. **Go to "Manage Integrations"** in your dashboard
2. **Click "Add New Integration"** button
3. **Fill in the form:**
   - Platform Type: Select "Facebook"
   - Status: Choose appropriate status (PENDING, CONNECTED, etc.)
   - App ID: Enter your Facebook App ID
   - App Secret: Enter your Facebook App Secret
4. **Click "Generate Access Token"** to automatically get an access token
5. **Click "Create Integration"**

**Note:** App credentials are now stored securely in the integrations table, and access tokens can be generated automatically.

## How to Get Facebook App Credentials

1. **Go to [Facebook Developers](https://developers.facebook.com/)**
2. **Create a new app** or select an existing one
3. **Go to Settings > Basic**
4. **Copy the App ID and App Secret**

## What This Feature Does

- **Fetches real-time token expiry** from Facebook's API
- **Updates your database** with the latest expiry information
- **Shows token validity** and permissions
- **Automatically refreshes** expiry dates when you click "Refresh Token Info"

## Security Note

- App Secret should never be exposed to the client
- Only used server-side to generate app access tokens
- Tokens are validated against Facebook's official API

## Usage

1. **Connect Facebook integration** in your app
2. **Click "Manage Integrations"**
3. **Find your Facebook integration**
4. **Click the blue info button (ℹ️)** to refresh token info
5. **View updated expiry date** in the "Expires At" column
