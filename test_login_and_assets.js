/**
 * Verification script for Login API, CSS Loading, Favicon, and Routes
 */
const http = require('http');
const app = require('./backend/server');

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`[Test Server] Running on ephemeral port ${port}`);

  function req(path, method = 'GET', body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const opt = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      const r = http.request(opt, res => {
        let buf = '';
        res.on('data', chunk => buf += chunk);
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(buf); } catch (e) { parsed = buf; }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      });
      r.on('error', reject);
      if (body) r.write(typeof body === 'string' ? body : JSON.stringify(body));
      r.end();
    });
  }

  try {
    console.log('\n--- 1. Testing Static Assets & Favicon ---');
    const indexRes = await req('/');
    if (indexRes.status === 200 && typeof indexRes.body === 'string' && indexRes.body.includes('ZEWA')) {
      console.log('  ✓ Root "/" serves index.html with 200 OK');
    } else {
      throw new Error(`Root failed: ${indexRes.status}`);
    }

    const cssRes = await req('/css/style.css');
    if (cssRes.status === 200 && typeof cssRes.body === 'string' && cssRes.body.includes('--color-primary')) {
      console.log('  ✓ "/css/style.css" loaded successfully with 200 OK');
    } else {
      throw new Error(`CSS failed: ${cssRes.status}`);
    }

    const favRes = await req('/favicon.ico');
    if (favRes.status === 200) {
      console.log('  ✓ "/favicon.ico" loaded successfully with 200 OK');
    } else {
      throw new Error(`Favicon failed: ${favRes.status}`);
    }

    console.log('\n--- 2. Testing Customer Demo Login ---');
    const custLogin = await req('/api/auth/login', 'POST', {
      email: 'customer@zewa.demo',
      password: 'demo_password_123'
    });
    if (custLogin.status === 200 && custLogin.body.success && custLogin.body.user.role === 'customer') {
      console.log(`  ✓ Customer demo login succeeded: ${custLogin.body.user.full_name}`);
    } else {
      throw new Error(`Customer login failed: ${JSON.stringify(custLogin.body)}`);
    }

    console.log('\n--- 3. Testing Restaurant Demo Login ---');
    const restLogin = await req('/api/auth/login', 'POST', {
      email: 'restaurant@zewa.demo',
      password: 'demo_password_123'
    });
    if (restLogin.status === 200 && restLogin.body.success && restLogin.body.user.role === 'restaurant') {
      console.log(`  ✓ Restaurant demo login succeeded: ${restLogin.body.user.full_name}`);
    } else {
      throw new Error(`Restaurant login failed: ${JSON.stringify(restLogin.body)}`);
    }

    console.log('\n--- 4. Testing Delivery Partner Demo Login ---');
    const delLogin = await req('/api/auth/login', 'POST', {
      email: 'delivery@zewa.demo',
      password: 'demo_password_123'
    });
    if (delLogin.status === 200 && delLogin.body.success && delLogin.body.user.role === 'delivery_partner') {
      console.log(`  ✓ Delivery partner demo login succeeded: ${delLogin.body.user.full_name}`);
    } else {
      throw new Error(`Delivery partner login failed: ${JSON.stringify(delLogin.body)}`);
    }

    console.log('\n--- 5. Testing Invalid Credentials & Meaningful Errors ---');
    const invalidEmail = await req('/api/auth/login', 'POST', {
      email: 'nonexistent@example.com',
      password: 'somepassword'
    });
    if (invalidEmail.status === 404 && invalidEmail.body.error.includes('No ZEWA account found')) {
      console.log(`  ✓ Unregistered email properly rejected with 404: "${invalidEmail.body.error}"`);
    } else {
      throw new Error(`Expected 404 for unknown email, got ${invalidEmail.status}`);
    }

    const wrongPass = await req('/api/auth/login', 'POST', {
      email: 'customer@zewa.demo',
      password: 'wrong_password'
    });
    if (wrongPass.status === 401 && wrongPass.body.error.includes('Incorrect password')) {
      console.log(`  ✓ Incorrect password rejected with 401: "${wrongPass.body.error}"`);
    } else {
      throw new Error(`Expected 401 for wrong password, got ${wrongPass.status}`);
    }

    console.log('\n=============================================');
    console.log('🎉 ALL LOGIN, ASSET, AND CSS TESTS PASSED 100%');
    console.log('=============================================\n');

    server.close(() => process.exit(0));
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    server.close(() => process.exit(1));
  }
});
