const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('treinos.db');

// --- TABELA DE USUÁRIOS (Atualizada conforme a Aula 06) ---
db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL
)
`);

// --- OUTRAS TABELAS (Mantenha as que você já tinha da Aula 05, ex: treinos) ---
db.exec(`
CREATE TABLE IF NOT EXISTS treinos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao TEXT NOT NULL
)
`);

// O professor Diego orientou remover os "ins.run" antigos daqui!
// As senhas em texto puro foram apagadas.

module.exports = db;
