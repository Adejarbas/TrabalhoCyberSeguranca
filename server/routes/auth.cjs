// ========================================
// Rotas de Autenticação (Login e Cadastro)
// ========================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database.cjs');
const { SEGREDO_JWT } = require('../middleware/auth.cjs');

const router = express.Router();

// ---- ROTA DE CADASTRO ----
// POST /api/auth/cadastro
router.post('/cadastro', (req, res) => {
  const { usuario, senha } = req.body;

  // Valida se os campos foram preenchidos
  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
  }

  // Verifica se o usuário já existe no banco
  const existente = db.prepare('SELECT id FROM usuarios WHERE usuario = ?').get(usuario);
  if (existente) {
    return res.status(400).json({ erro: 'Este usuário já está cadastrado' });
  }

  // Criptografa a senha usando bcrypt (hash de 10 rounds)
  // Nunca armazenamos senhas em texto puro!
  const senhaHash = bcrypt.hashSync(senha, 10);

  // Insere o novo usuário no banco de dados
  const stmt = db.prepare('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)');
  const resultado = stmt.run(usuario, senhaHash);

  res.status(201).json({
    mensagem: 'Usuário cadastrado com sucesso!',
    id: resultado.lastInsertRowid
  });
});

// ---- ROTA DE LOGIN ----
// POST /api/auth/login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Valida se os campos foram preenchidos
  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
  }

  // Busca o usuário no banco de dados
  const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario);
  if (!user) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
  }

  // Compara a senha digitada com o hash armazenado no banco
  const senhaValida = bcrypt.compareSync(senha, user.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
  }

  // Gera o token JWT com validade de 2 horas
  const token = jwt.sign(
    { id: user.id, usuario: user.usuario },
    SEGREDO_JWT,
    { expiresIn: '2h' }
  );

  res.json({
    mensagem: 'Login realizado com sucesso!',
    token,
    usuario: user.usuario
  });
});

module.exports = router;
