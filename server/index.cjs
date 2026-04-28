// ========================================
// Servidor Express - Backend Principal
// ========================================
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.cjs');
const cryptoRoutes = require('./routes/crypto.cjs');

const app = express();
const PORTA = 3001;

// --- Middlewares ---
app.use(cors());           // Permite requisições vindas do frontend (porta diferente)
app.use(express.json());   // Permite receber dados em formato JSON

// --- Rotas da API ---
app.use('/api/auth', authRoutes);   // Rotas de login e cadastro
app.use('/api', cryptoRoutes);      // Rotas de criptografar e descriptografar

// Inicia o servidor
app.listen(PORTA, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORTA}`);
});
