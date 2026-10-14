/**
 * Community Emergency Response & Resource Management System
 * Production & Local Server with SQL-Powered Authentication (Admin & Citizen)
 * Real-time Backend Database Logging & Inspection
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const sqlDB = require('./backend/sql_db');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.sql': 'text/plain; charset=utf-8'
};

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ==========================================
  // SQL AUTHENTICATION REST API WITH BACKEND LOGGING
  // ==========================================
  if (pathname.startsWith('/api/auth/')) {
    try {
      // 1. SQL Login Endpoint
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseRequestBody(req);
        if (!body.email || !body.password) {
          return sendJSON(res, { success: false, error: 'Email and password required' }, 400);
        }
        const user = sqlDB.authenticate(body.email, body.password);
        if (user) {
          console.log(`\n🔑 [BACKEND SQL AUTH SUCCESS]`);
          console.log(`   👤 User: ${user.name} | Role: ${user.role.toUpperCase()} | Email: ${user.email} | ID: ${user.id}`);
          return sendJSON(res, { success: true, message: 'Logged in successfully via SQL', user });
        }
        console.log(`\n❌ [BACKEND SQL AUTH FAILED] Attempt for email: ${body.email}`);
        return sendJSON(res, { success: false, error: 'Invalid email or password' }, 401);
      }

      // 2. SQL Register Endpoint (Citizen or Admin)
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await parseRequestBody(req);
        if (!body.email || !body.name || !body.password) {
          return sendJSON(res, { success: false, error: 'Name, email, and password are required' }, 400);
        }
        const existing = sqlDB.getUserByEmail(body.email);
        if (existing) {
          return sendJSON(res, { success: false, error: 'This email is already registered in SQL database' }, 400);
        }
        const newUser = sqlDB.createUser(body);

        // Detailed Backend Console Logging
        console.log(`\n=============================================================`);
        console.log(`💾 [BACKEND SQL INSERT] NEW ACCOUNT STORED IN database.sqlite`);
        console.log(`=============================================================`);
        console.log(`   🆔 User ID:     ${newUser.id}`);
        console.log(`   👤 Name:        ${newUser.name}`);
        console.log(`   ✉️ Email:       ${newUser.email}`);
        console.log(`   🛡️ Role:        ${newUser.role.toUpperCase()}`);
        console.log(`   📱 Phone:       ${newUser.phone || 'N/A'}`);
        console.log(`   📍 Area/City:   ${newUser.city || newUser.area || 'N/A'}`);
        console.log(`   🩸 Blood Group: ${newUser.bloodGroup || 'N/A'}`);
        console.log(`   ⏰ Created At:  ${new Date().toISOString()}`);
        console.log(`=============================================================\n`);

        return sendJSON(res, { success: true, message: 'Account created and saved in SQL database', user: newUser });
      }

      // 3. SQL Get All Users
      if (pathname === '/api/auth/users' && req.method === 'GET') {
        const users = sqlDB.getAllUsers();
        return sendJSON(res, { success: true, users });
      }

      // 4. SQL Update User Profile
      if (pathname.startsWith('/api/auth/users/') && req.method === 'PUT') {
        const id = pathname.replace('/api/auth/users/', '');
        const body = await parseRequestBody(req);
        const updated = sqlDB.updateUser(id, body);
        console.log(`\n📝 [BACKEND SQL UPDATE] User ID ${id} profile updated in database.sqlite`);
        return sendJSON(res, { success: true, user: updated });
      }

      return sendJSON(res, { error: 'Auth route not found' }, 404);
    } catch (authErr) {
      console.error('SQL Auth API Error:', authErr);
      return sendJSON(res, { error: authErr.message }, 500);
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let cleanUrl = pathname;
  if (cleanUrl === '/' || cleanUrl === '') {
    cleanUrl = '/index.html';
  }

  const safePath = path.normalize(cleanUrl).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexFallback = path.join(BASE_DIR, 'index.html');
      fs.readFile(indexFallback, (errIndex, content) => {
        if (errIndex) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Content-Length': content.length
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚨 Community Emergency Response System is Live!`);
  console.log(`🗄️ SQL Database Engine: database.sqlite (Users Table Active)`);
  console.log(`======================================================`);
  console.log(`Local Browser URL:   http://localhost:${PORT}`);
  console.log(`Mobile Network URL:  http://192.168.31.8:${PORT}`);
  console.log(`SQL Auth API:        http://localhost:${PORT}/api/auth/login`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is busy, retrying on port ${Number(PORT) + 1}...`);
    server.listen(Number(PORT) + 1);
  } else {
    console.error('Server error:', err);
  }
});
