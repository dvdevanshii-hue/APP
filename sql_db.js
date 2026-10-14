/**
 * Community Emergency Response & Resource Management System
 * SQL Database Engine for User Authentication (Admin & Citizen)
 * Backed by native node:sqlite and database.sqlite
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');
const SCHEMA_PATH = path.join(__dirname, '..', 'schema.sql');

class SQLAuthDatabase {
  constructor() {
    this.db = new DatabaseSync(DB_PATH);
    this.init();
  }

  init() {
    if (fs.existsSync(SCHEMA_PATH)) {
      const sql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
      try {
        this.db.exec(sql);
        console.log('✅ SQLite Authentication Tables & Accounts loaded from schema.sql');
      } catch (err) {
        console.error('SQL schema load error:', err.message);
      }
    }
    console.log('🗄️ SQL Auth Database ready at:', DB_PATH);
  }

  queryAll(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.all(...params);
    } catch (err) {
      console.error('SQL Query Error:', sql, err);
      return [];
    }
  }

  queryOne(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.get(...params) || null;
    } catch (err) {
      console.error('SQL QueryOne Error:', sql, err);
      return null;
    }
  }

  execute(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.run(...params);
    } catch (err) {
      console.error('SQL Execute Error:', sql, err);
      throw err;
    }
  }

  // ================= USERS / AUTH =================
  getAllUsers() {
    return this.queryAll('SELECT id, name, email, phone, role, area, city, blood_group as bloodGroup, volunteer_status as volunteerStatus, avatar, created_at as createdAt FROM users ORDER BY created_at DESC');
  }

  getUserById(id) {
    return this.queryOne('SELECT id, name, email, phone, role, area, city, blood_group as bloodGroup, volunteer_status as volunteerStatus, avatar, created_at as createdAt FROM users WHERE id = ?', [id]);
  }

  getUserByEmail(email) {
    return this.queryOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
  }

  createUser(u) {
    const id = u.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    this.execute(
      `INSERT INTO users (id, name, email, password, phone, role, area, city, blood_group, volunteer_status, avatar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        u.name, 
        u.email, 
        u.password || 'password123', 
        u.phone || '', 
        u.role || 'citizen', 
        u.area || '', 
        u.city || '', 
        u.bloodGroup || '', 
        u.volunteerStatus || (u.role === 'admin' ? 'Coordinator' : 'Registered Citizen'), 
        u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      ]
    );
    return this.getUserById(id);
  }

  updateUser(id, u) {
    this.execute(
      `UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), area = COALESCE(?, area), 
       city = COALESCE(?, city), blood_group = COALESCE(?, blood_group), volunteer_status = COALESCE(?, volunteer_status)
       WHERE id = ?`,
      [u.name, u.phone, u.area, u.city, u.bloodGroup, u.volunteerStatus, id]
    );
    return this.getUserById(id);
  }

  authenticate(email, password) {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...userSafe } = user;
      userSafe.bloodGroup = user.blood_group;
      userSafe.volunteerStatus = user.volunteer_status;
      return userSafe;
    }
    return null;
  }
}

module.exports = new SQLAuthDatabase();
