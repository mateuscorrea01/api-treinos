const Database = require('better-sqlite3');

const db = new Database('./treinos.db');

module.exports = db;
