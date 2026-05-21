const https = require('https');
const fs = require('fs');
const path = require('path');

// Basic .env.local parser
function getEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val) env[key.trim()] = val.join('=').trim();
  });
  return env;
}

async function testSignup() {
  const env = getEnv();
  const urlString = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!urlString || !key) {
    console.error('Missing env vars');
    return;
  }

  console.log('Testing Supabase URL:', urlString);

  const url = new URL(`${urlString}/auth/v1/signup`);
  const body = JSON.stringify({
    email: 'test' + Date.now() + '@example.com',
    password: 'password123'
  });

  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'apikey': key,
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
        try {
          console.log('Response (JSON):', JSON.parse(data));
        } catch (e) {
          console.log('Failed to parse JSON:', data);
        }
      } else {
        console.log('Response (NOT JSON):', data.substring(0, 500));
      }
    });
  });

  req.on('error', (e) => { console.error('Request Error:', e); });
  req.write(body);
  req.end();
}

testSignup();
