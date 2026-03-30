# Firebase OAuth for Data Integrations

## Can you use it for API Data?
**Yes.** When you use Firebase Authentication with a provider (like Facebook, Google, etc.), you receive an **OAuth Access Token** immediately after login. You can use this token to make API requests (e.g., to the Graph API).

## Does it "Manage" the Integration?
**No.** Firebase verifies the *Identity* (Login), but it does not persist the *Authorization* (API Tokens) in a way that your backend can use offline for background jobs.

**You must implement the "Management" part:**
1.  **Capture**: Catch the token on the client immediately after login.
2.  **Save**: Send it to your backend (to be stored in your `integrations` table).
3.  **Use**: Your backend reads from the database to run jobs (like your `socialMediaDataCache`).

## Implementation Pattern

### 1. Client-Side (React/Next.js)
You cannot just use `useAuthState()`. You must use the **Promise return value** of the sign-in method to get the credentials *once*.

```typescript
// src/components/ConnectFacebookButton.tsx
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { app } from "@/lib/firebase"; // Your firebase initialization

const connectFacebook = async () => {
  const auth = getAuth(app);
  const provider = new FacebookAuthProvider();
  
  // Scopes are CRITICAL for data access
  provider.addScope('pages_show_list');
  provider.addScope('pages_read_engagement');
  provider.addScope('instagram_basic');

  try {
    const result = await signInWithPopup(auth, provider);
    
    // This is the "Magic" object containing the tokens
    // It is ONLY available right here, right now.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    
    if (accessToken) {
      // 🚀 STEP 2: Send to your backend immediately
      await saveIntegrationToBackend(accessToken);
    }
    
  } catch (error) {
    console.error("Error connecting Facebook:", error);
  }
};

async function saveIntegrationToBackend(token: string) {
  // Call your existing API (which likely writes to your 'integrations' table)
  await fetch('/api/integrations/facebook', {
    method: 'POST',
    body: JSON.stringify({ accessToken: token }),
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 2. Backend-Side (Your existing API)
Your backend remains mostly the same. It receives the token and saves it.

```typescript
// src/pages/api/integrations/facebook.ts (Conceptual)
import { db } from "@/db/db";
import { integrations } from "@/db/schema";

export default async function handler(req, res) {
  const { accessToken } = req.body;
  const companyId = req.user.companyId; // Assumed from session

  // 1. Extend Token? (Optional but recommended)
  // Facebook tokens from client are short-lived (1-2 hours).
  // You might want to call Facebook's "exchange" endpoint here 
  // to get a 60-day token BEFORE saving.
  // const longLivedToken = await exchangeForLongLived(accessToken);

  // 2. Save/Update DB
  await db.insert(integrations).values({
    type: 'FACEBOOK',
    accessToken: accessToken, // or longLivedToken
    status: 'CONNECTED',
    companyId,
  });

  res.status(200).json({ success: true });
}
```

## Summary
*   **Firebase Role**: Handles the popup, user consent, and initial token handshake.
*   **Your Role**: Capture that token, exchange it for a long-lived one (if needed), and save it to your database.
