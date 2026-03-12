import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import admin from "firebase-admin";
import complianceRoutes from "./api/complianceRoutes.ts";
import syncRoutes from "./nowcerts-sync/syncRoutes.ts";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server...");
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize Firebase Admin
  try {
    if (!admin.apps.length) {
      console.log("Initializing Firebase Admin...");
      admin.initializeApp({
        projectId: "rmiaiapp"
      });
      console.log("Firebase Admin initialized.");
    }
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
  }

  const dbAdmin = admin.firestore();

  // Increase payload limit if needed for large quotes
  app.use(express.json({ limit: '50mb' }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/log", (req, res) => {
    try {
      // Use /tmp for logs in serverless environments
      const logPath = process.env.NODE_ENV === 'production' ? '/tmp/browser-errors.log' : 'browser-errors.log';
      fs.appendFileSync(logPath, JSON.stringify(req.body) + '\n');
      res.json({ status: "ok" });
    } catch (e) {
      console.error("Failed to write log:", e);
      res.status(500).json({ error: "Failed to write log" });
    }
  });

  app.use('/api/compliance', complianceRoutes);
  app.use('/api/sync', syncRoutes);

  // --- Firebase Admin DB Routes ---
  app.get('/api/db/leads', async (req, res) => {
    try {
      const snapshot = await dbAdmin.collection('leads').get();
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(leads);
    } catch (error: any) {
      if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
         console.warn('Firestore access denied (server-side). Falling back to client mock data.');
         res.status(403).json({ error: 'Firestore permission denied' });
      } else {
         console.error('Error fetching leads:', error);
         res.status(500).json({ error: 'Failed to fetch leads' });
      }
    }
  });

  app.post('/api/db/leads', async (req, res) => {
    try {
      const data = req.body;
      // Basic validation
      if (!data) {
        return res.status(400).json({ error: 'No data provided' });
      }
      
      const docRef = await dbAdmin.collection('leads').add({
        ...data,
        createdAt: new Date().toISOString() // Ensure server timestamp or use provided
      });
      
      res.json({ id: docRef.id });
    } catch (error: any) {
      console.error('Error saving lead:', error);
      res.status(500).json({ error: 'Failed to save lead' });
    }
  });

  app.get('/api/db/inspections', async (req, res) => {
    try {
      const snapshot = await dbAdmin.collection('inspections').get();
      const inspections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(inspections);
    } catch (error: any) {
      if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
         res.status(403).json({ error: 'Firestore permission denied' });
      } else {
         console.error('Error fetching inspections:', error);
         res.status(500).json({ error: 'Failed to fetch inspections' });
      }
    }
  });

  app.get('/api/db/users', async (req, res) => {
    try {
      const snapshot = await dbAdmin.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(users);
    } catch (error: any) {
      if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
         res.status(403).json({ error: 'Firestore permission denied' });
      } else {
         console.error('Error fetching users:', error);
         res.status(500).json({ error: 'Failed to fetch users' });
      }
    }
  });

  app.get('/api/db/tickets', async (req, res) => {
    try {
      const snapshot = await dbAdmin.collection('tickets').orderBy('updatedAt', 'desc').get();
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(tickets);
    } catch (error: any) {
      if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
         res.status(403).json({ error: 'Firestore permission denied' });
      } else {
         console.error('Error fetching tickets:', error);
         res.status(500).json({ error: 'Failed to fetch tickets' });
      }
    }
  });

  app.post('/api/db/tickets', async (req, res) => {
    try {
      const ticket = req.body;
      if (!ticket || !ticket.id) {
        return res.status(400).json({ error: 'Invalid ticket data' });
      }
      await dbAdmin.collection('tickets').doc(ticket.id).set(ticket);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving ticket:', error);
      res.status(500).json({ error: 'Failed to save ticket' });
    }
  });

  app.get('/api/db/threads', async (req, res) => {
    try {
      const snapshot = await dbAdmin.collection('threads').get();
      const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(threads);
    } catch (error: any) {
      if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
         res.status(403).json({ error: 'Firestore permission denied' });
      } else {
         console.error('Error fetching threads:', error);
         res.status(500).json({ error: 'Failed to fetch threads' });
      }
    }
  });

  // --- Gmail API Integration ---
  const GMAIL_TOKEN_PATH = process.env.NODE_ENV === 'production' 
      ? '/tmp/gmail-token.json' 
      : path.join(__dirname, 'gmail-token.json');

  // Support both specific and generic environment variable names (case-insensitive attempts)
  const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || process.env.CLIENT_ID || process.env.gmail_client_id || process.env.client_id;
  const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || process.env.CLIENT_SECRET || process.env.gmail_client_secret || process.env.client_secret;
  
  console.log('Gmail Config Status:', {
    hasClientId: !!GMAIL_CLIENT_ID,
    hasClientSecret: !!GMAIL_CLIENT_SECRET,
    clientIdSource: GMAIL_CLIENT_ID ? (process.env.GMAIL_CLIENT_ID ? 'GMAIL_CLIENT_ID' : process.env.CLIENT_ID ? 'CLIENT_ID' : 'lowercase') : 'missing'
  });
  
  // Use the current request host to construct the redirect URI dynamically
  // or use a fixed one if provided in env
  const GMAIL_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'https://ais-dev-s4kjzld7j4hzir47bgnvwo-4585612311.us-west2.run.app/api/auth/gmail/callback';

  function readGmailToken() {
    try {
      if (fs.existsSync(GMAIL_TOKEN_PATH)) {
        return JSON.parse(fs.readFileSync(GMAIL_TOKEN_PATH, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading Gmail token file:', e);
    }
    return null;
  }

  function writeGmailToken(data: any) {
    try {
      fs.writeFileSync(GMAIL_TOKEN_PATH, JSON.stringify(data), 'utf-8');
    } catch (e) {
      console.error('Error writing Gmail token file:', e);
    }
  }

  let gmailTokenData = readGmailToken();

  async function refreshGmailToken() {
    if (!gmailTokenData || !gmailTokenData.refresh_token) return null;

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: GMAIL_CLIENT_ID!,
          client_secret: GMAIL_CLIENT_SECRET!,
          refresh_token: gmailTokenData.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to refresh Gmail token:', error);
        return null;
      }

      const data = await response.json();
      gmailTokenData = {
        ...gmailTokenData,
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in * 1000) - 60000,
      };
      writeGmailToken(gmailTokenData);
      return data.access_token;
    } catch (e) {
      console.error('Error refreshing Gmail token:', e);
      return null;
    }
  }

  async function getValidGmailToken() {
    if (!gmailTokenData) return null;
    if (Date.now() < gmailTokenData.expires_at) return gmailTokenData.access_token;
    return await refreshGmailToken();
  }

  app.get('/api/auth/gmail/url', (req, res) => {
    if (!GMAIL_CLIENT_ID) {
      console.error('Gmail Client ID is missing in environment variables');
      return res.status(500).json({ error: 'Gmail Client ID not configured on server' });
    }
    
    // Construct the redirect URI based on the request host to support both dev and prod
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const redirectUri = `${protocol}://${host}/api/auth/gmail/callback`;

    const params = new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.modify',
      access_type: 'offline',
      prompt: 'consent', // Force refresh token
    });
    
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  });

  // ... (rest of the routes)

  app.get('/api/auth/gmail/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers['x-forwarded-host'] || req.get('host');
      const redirectUri = `${protocol}://${host}/api/auth/gmail/callback`;

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: GMAIL_CLIENT_ID!,
          client_secret: GMAIL_CLIENT_SECRET!,
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(500).send(`Failed to exchange code: ${error}`);
      }

      const data = await response.json();
      gmailTokenData = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in * 1000) - 60000,
      };
      writeGmailToken(gmailTokenData);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GMAIL_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Gmail authentication successful! You can close this window.</p>
          </body>
        </html>
      `);
    } catch (e) {
      console.error('Gmail auth error:', e);
      res.status(500).send('Authentication failed');
    }
  });

  app.get('/api/gmail/status', (req, res) => {
    res.json({ connected: !!gmailTokenData });
  });

  app.get('/api/gmail/threads', async (req, res) => {
    const token = await getValidGmailToken();
    if (!token) return res.status(401).json({ error: 'Gmail not connected' });

    try {
      const query = req.query.q ? `&q=${encodeURIComponent(req.query.q as string)}` : '';
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=100${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch threads');
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error('Gmail threads error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/gmail/threads/:id', async (req, res) => {
    const token = await getValidGmailToken();
    if (!token) return res.status(401).json({ error: 'Gmail not connected' });

    try {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${req.params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch thread');
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error('Gmail thread error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/gmail/messages/:id', async (req, res) => {
    const token = await getValidGmailToken();
    if (!token) return res.status(401).json({ error: 'Gmail not connected' });

    try {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${req.params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch message');
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error('Gmail message error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/gmail/send', async (req, res) => {
    const token = await getValidGmailToken();
    if (!token) return res.status(401).json({ error: 'Gmail not connected' });

    const { to, cc, bcc, subject, body } = req.body;

    // Create email content
    const emailContent = [
      `To: ${to}`,
      cc ? `Cc: ${cc}` : '',
      bcc ? `Bcc: ${bcc}` : '',
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body
    ].filter(line => line !== '').join('\n');

    const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedEmail }),
      });
      
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to send email: ${err}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error('Gmail send error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // --- NowCerts Proxy Logic ---
  // Use /tmp for token storage in serverless environments to ensure writability
  const TOKEN_FILE_PATH = process.env.NODE_ENV === 'production' 
      ? '/tmp/nowcerts-token.json' 
      : path.join(__dirname, 'nowcerts-token.json');

  // Credentials for Password Grant (Fallback)
  // In production, these should be environment variables
  const NC_USERNAME = process.env.NOWCERTS_USERNAME || 'chase@reducemyinsurance.net';
  const NC_PASSWORD = process.env.NOWCERTS_PASSWORD || 'TempPassword!1';
  const NC_CLIENT_ID = 'ngAuthApp';

  function readTokenData() {
    try {
      if (fs.existsSync(TOKEN_FILE_PATH)) {
        return JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading token file:', e);
    }
    return null;
  }

  function writeTokenData(data: any) {
    try {
      fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(data), 'utf-8');
    } catch (e) {
      console.error('Error writing token file:', e);
    }
  }

  let tokenData = readTokenData() || {};
  let currentAccessToken = tokenData.access_token || '';
  let currentRefreshToken = tokenData.refresh_token || process.env.NOWCERTS_REFRESH_TOKEN || '';
  // Calculate expiry based on stored time or default to 0 (expired)
  let tokenExpiresAt = tokenData.expires_at || 0;

  async function authenticateNowCerts() {
    // 1. Try Refresh Token Flow first (if we have one)
    if (currentRefreshToken) {
      try {
        console.log('Attempting to refresh NowCerts token...');
        const response = await fetch('https://api.nowcerts.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: `grant_type=refresh_token&refresh_token=${currentRefreshToken}&client_id=${NC_CLIENT_ID}`
        });

        if (response.ok) {
          const data = await response.json();
          handleTokenResponse(data);
          return;
        } else {
          // Silent fallback
          console.log('Refresh token expired or invalid. Falling back to password grant.');
          currentRefreshToken = ''; // Clear bad refresh token
        }
      } catch (e) {
        console.error('Refresh token error:', e);
        currentRefreshToken = ''; // Clear bad refresh token
      }
    }

    // 2. Fallback to Password Grant Flow
    try {
      console.log('Attempting NowCerts login via Password Grant...');
      const response = await fetch('https://api.nowcerts.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: `grant_type=password&username=${encodeURIComponent(NC_USERNAME)}&password=${encodeURIComponent(NC_PASSWORD)}&client_id=${NC_CLIENT_ID}`
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Login failed: ${err}`);
      }

      const data = await response.json();
      handleTokenResponse(data);
    } catch (e) {
      console.error("Authentication failed:", e);
      throw e;
    }
  }

  function handleTokenResponse(data: any) {
    currentAccessToken = data.access_token;
    if (data.refresh_token) {
      currentRefreshToken = data.refresh_token;
    }
    // expires_in is in seconds. Subtract 60s buffer.
    tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000;
    
    // Persist to file
    const storageData = {
      access_token: currentAccessToken,
      refresh_token: currentRefreshToken,
      expires_at: tokenExpiresAt
    };
    writeTokenData(storageData);
    console.log('NowCerts authenticated successfully. Token cached.');
  }

  app.all('/api/nowcerts/*', async (req, res) => {
    try {
      // Check if token is missing or expired
      if (!currentAccessToken || Date.now() > tokenExpiresAt) {
        await authenticateNowCerts();
      }

      const targetPath = req.originalUrl.replace('/api/nowcerts', '');
      const targetUrl = `https://api.nowcerts.com${targetPath}`;
      console.log(`[Proxy] targetUrl: ${targetUrl}`);
      
      const fetchOptions: RequestInit = {
        method: req.method,
        headers: {
          'Accept': req.headers.accept || 'application/json',
          'Content-Type': req.headers['content-type'] || 'application/json'
        }
      };

      if (currentAccessToken) {
        (fetchOptions.headers as any)['Authorization'] = `Bearer ${currentAccessToken}`;
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(req.body);
      }

      let response = await fetch(targetUrl, fetchOptions);
      
      // If 401, token might have been revoked externally or expired unexpectedly
      if (response.status === 401) {
         console.log('Received 401 from NowCerts. Forcing re-authentication...');
         // Clear current token to force fresh login
         currentAccessToken = '';
         currentRefreshToken = ''; // Force password grant if refresh fails
         
         await authenticateNowCerts();
         
         if (currentAccessToken) {
           (fetchOptions.headers as any)['Authorization'] = `Bearer ${currentAccessToken}`;
           response = await fetch(targetUrl, fetchOptions);
         }
      }

      const data = await response.text();
      const logLine = `[Proxy] targetUrl: ${targetUrl}, Response status: ${response.status}, length: ${data.length}\n`;
      console.log(logLine);
      try {
          fs.appendFileSync('proxy-debug.log', logLine);
          if (targetUrl.includes('PolicyDetailList') || targetUrl.includes('InsuredList')) {
              fs.appendFileSync('proxy-debug.log', `[Proxy] Response snippet: ${data.substring(0, 200)}\n`);
          }
      } catch (e) {}
      res.status(response.status).send(data);

    } catch (error: any) {
      console.error('NowCerts Proxy Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for API routes to prevent falling through to SPA
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // --- Vite Middleware & SPA Fallback ---
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    // Include .jfif MIME type since it's not in the default mime database
    app.use(express.static(path.join(__dirname, "dist"), {
      setHeaders(res, filePath) {
        if (filePath.endsWith('.jfif')) {
          res.setHeader('Content-Type', 'image/jpeg');
        }
      }
    }));
    // Explicitly serve sitemap and robots so Googlebot always gets valid XML/text
    // even if the SPA catch-all would otherwise intercept these paths
    app.get('/sitemap.xml', (req, res) => {
      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      res.sendFile(path.join(__dirname, 'dist', 'sitemap.xml'));
    });
    app.get('/robots.txt', (req, res) => {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.sendFile(path.join(__dirname, 'dist', 'robots.txt'));
    });
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
