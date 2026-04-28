// ========================================
// Rotas de Criptografia (Cifra de César)
// ========================================
const express = require('express');
const crypto = require('crypto');
const db = require('../database.cjs');
const { verificarToken } = require('../middleware/auth.cjs');

const router = express.Router();

// Alfabeto usado na cifra: letras minúsculas + números (a-z, 0-9)
const ALFABETO = 'abcdefghijklmnopqrstuvwxyz0123456789';

// ---- FUNÇÃO: Cifra de César ----
// Desloca cada caractere do texto pelo número de posições (passo)
function cifrarCesar(texto, passo) {
  let resultado = '';

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i].toLowerCase();
    const indice = ALFABETO.indexOf(char);

    if (indice !== -1) {
      // Calcula a nova posição com o deslocamento circular
      let novoIndice = (indice + passo) % ALFABETO.length;
      // Trata deslocamentos negativos
      if (novoIndice < 0) novoIndice += ALFABETO.length;
      resultado += ALFABETO[novoIndice];
    } else {
      // Mantém caracteres fora do alfabeto (espaços, pontuação, etc.)
      resultado += char;
    }
  }

  return resultado;
}

// ---- FUNÇÃO: Decifrar César ----
// Simplesmente inverte o passo para voltar ao texto original
function decifrarCesar(texto, passo) {
  return cifrarCesar(texto, -passo);
}

// ---- FUNÇÃO: Gerar Hash ----
// Cria um hash aleatório de 32 caracteres hexadecimais
function gerarHash() {
  return crypto.randomBytes(16).toString('hex');
}

// ---- ROTA: CRIPTOGRAFAR ----
// POST /api/criptografar
router.post('/criptografar', verificarToken, (req, res) => {
  const { mensagem, passo } = req.body;

  // Validações dos campos
  if (!mensagem || passo === undefined) {
    return res.status(400).json({ erro: 'Mensagem e passo são obrigatórios' });
  }

  const passoNumero = parseInt(passo);
  if (isNaN(passoNumero)) {
    return res.status(400).json({ erro: 'O passo deve ser um número' });
  }

  // Aplica a Cifra de César na mensagem
  const mensagemCriptografada = cifrarCesar(mensagem, passoNumero);

  // Gera o hash único (chave privada para descriptografar)
  const hashChave = gerarHash();

  // Salva no banco: hash, passo e mensagem criptografada
  const stmt = db.prepare(
    'INSERT INTO mensagens (usuario_id, hash_chave, passo, mensagem_criptografada, usado) VALUES (?, ?, ?, ?, 0)'
  );
  stmt.run(req.usuario.id, hashChave, passoNumero, mensagemCriptografada);

  res.json({
    mensagemCriptografada,
    hashChave,
    aviso: 'Guarde o hash! Ele só pode ser usado UMA ÚNICA VEZ para descriptografar.'
  });
});

// ---- ROTA: DESCRIPTOGRAFAR ----
// POST /api/descriptografar
router.post('/descriptografar', verificarToken, (req, res) => {
  const { mensagemCriptografada, hashChave } = req.body;

  // Validações dos campos
  if (!mensagemCriptografada || !hashChave) {
    return res.status(400).json({ erro: 'Mensagem criptografada e hash são obrigatórios' });
  }

  // Busca o hash no banco de dados
  const registro = db.prepare('SELECT * FROM mensagens WHERE hash_chave = ?').get(hashChave);

  // Verifica se o hash existe
  if (!registro) {
    return res.status(404).json({ erro: 'Hash não encontrado. Verifique se digitou corretamente.' });
  }

  // Verifica se o hash já foi usado (cada hash só pode ser usado 1 vez)
  if (registro.usado) {
    return res.status(400).json({ erro: 'Este hash já foi utilizado! Cada hash só pode ser usado uma única vez.' });
  }

  // Descriptografa a mensagem usando o passo armazenado no banco
  const mensagemOriginal = decifrarCesar(mensagemCriptografada, registro.passo);

  // Marca o hash como usado no banco de dados
  db.prepare('UPDATE mensagens SET usado = 1 WHERE hash_chave = ?').run(hashChave);

  res.json({
    mensagemOriginal,
    aviso: 'Hash marcado como utilizado. Não poderá ser usado novamente.'
  });
});

module.exports = router;
