// ========================================
// Middleware de Autenticação JWT
// ========================================
// JWT (JSON Web Token) garante:
// - Autenticidade: só o servidor gera tokens válidos
// - Integridade: o token não pode ser alterado sem invalidá-lo
// - Confidencialidade: os dados do usuário ficam protegidos

const jwt = require('jsonwebtoken');

// Chave secreta usada para assinar e verificar os tokens JWT
const SEGREDO_JWT = 'chave-secreta-cifra-cesar-2026';

// Middleware que verifica se o usuário está autenticado
function verificarToken(req, res, next) {
  // Pega o token do cabeçalho Authorization (formato: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Se não enviou token, bloqueia o acesso
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login primeiro.' });
  }

  try {
    // Verifica se o token é válido e não expirou
    const decoded = jwt.verify(token, SEGREDO_JWT);
    req.usuario = decoded; // Salva os dados do usuário na requisição
    next(); // Permite continuar para a rota
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado. Faça login novamente.' });
  }
}

module.exports = { verificarToken, SEGREDO_JWT };
