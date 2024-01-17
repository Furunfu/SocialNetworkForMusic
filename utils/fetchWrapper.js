let token = null;
let tokenExpiration = null;

async function fetchToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    token = data.access_token;
    // Imposta il tempo di scadenza del token
    tokenExpiration = Date.now() + data.expires_in * 1000;
}

async function recToken() {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      }),
      method: 'POST'
    };
  
    try {
      const response = await fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: authOptions.body
      });
  
      if (response.status === 200) {
        const data = await response.json();
        const token = data.access_token;
        return token;
      } else {
        throw new Error('Failed to authenticate');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

async function fetchWithToken(url, options = {}) {
    // Controlla se il token è scaduto o non esiste e, in caso affermativo, ne richiede uno nuovo
    if (!token || Date.now() > tokenExpiration) {
        await fetchToken();
    }
    // Imposta l'intestazione di autorizzazione
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, options);
}

module.exports = {recToken,fetchWithToken};