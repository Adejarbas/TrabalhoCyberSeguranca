// ========================================
// Configuração do Banco de Dados SQLite
// ========================================
const Database = require('better-sqlite3');
const path = require('path');

// Cria (ou abre) o arquivo do banco de dados SQLite
const db = new Database(path.join(__dirname, 'database.sqlite'));



// Cria a tabela de usuários (se não existir)
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Cria a tabela de mensagens criptografadas (se não existir)
// A coluna "usado" controla se o hash já foi utilizado (0 = não, 1 = sim)
db.exec(`
  CREATE TABLE IF NOT EXISTS mensagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    hash_chave TEXT UNIQUE NOT NULL,
    passo INTEGER NOT NULL,
    mensagem_criptografada TEXT NOT NULL,
    usado INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )
`);

module.exports = db;
