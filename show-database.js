/**
 * Backend SQL Database Viewer
 * Run this directly in terminal to inspect all stored data in SQLite database
 * Usage: & "C:\Users\DELL\AppData\Roaming\Antigravity\bin\agy-node.cmd" show-database.js
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(DB_PATH);

console.log('\n=============================================================');
console.log('🗄️  SQL DATABASE BACKEND STORAGE INSPECTOR (database.sqlite)');
console.log('=============================================================\n');

try {
  const users = db.prepare('SELECT id, name, email, role, phone, city, blood_group, created_at FROM users ORDER BY created_at DESC').all();

  console.log(`📊 TOTAL REGISTERED USERS IN SQL DATABASE: ${users.length}\n`);
  
  if (users.length === 0) {
    console.log('No users registered yet.');
  } else {
    console.table(users.map(u => ({
      'SQL ID': u.id,
      'Name': u.name,
      'Email': u.email,
      'Role': u.role.toUpperCase(),
      'Phone': u.phone || '-',
      'City / Area': u.city || '-',
      'Blood Group': u.blood_group || '-',
      'Registered At': u.created_at
    })));
  }
} catch (err) {
  console.error('Error reading SQL Database:', err.message);
}

console.log('\n=============================================================\n');
