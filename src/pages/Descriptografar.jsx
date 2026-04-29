// ========================================
// Tela de Descriptografar Mensagem
// ========================================
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Descriptografar() {
  const [mensagemCriptografada, setMensagemCriptografada] = useState('');
  const [hashChave, setHashChave] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { token } = useAuth();

  // Envia a mensagem criptografada e o hash para o backend descriptografar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3001/api/descriptografar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o JWT para autenticação
        },
        body: JSON.stringify({ mensagemCriptografada, hashChave })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao descriptografar');
        return;
      }

      // Exibe a mensagem original
      setResultado(dados);
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card card-largo">
      <h2>Descriptografar</h2>
      <p className="card-subtitulo">Cifra de César - Recuperar mensagem original</p>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label htmlFor="mensagem-cripto">Mensagem Criptografada</label>
          <textarea
            id="mensagem-cripto"
            value={mensagemCriptografada}
            onChange={(e) => setMensagemCriptografada(e.target.value)}
            placeholder="Cole aqui a mensagem criptografada..."
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="hash">Hash (Chave Privada)</label>
          <input
            id="hash"
            type="text"
            value={hashChave}
            onChange={(e) => setHashChave(e.target.value)}
            placeholder="Cole aqui o hash recebido na criptografia"
            required
          />
          <span className="dica-campo">
            Cada hash só pode ser usado uma única vez
          </span>
        </div>

        <button type="submit" className="btn-principal" disabled={carregando}>
          {carregando ? 'Descriptografando...' : 'Descriptografar'}
        </button>
      </form>

      {/* Exibe o resultado após descriptografar */}
      {resultado && (
        <div className="resultado-box">
          <h3>Mensagem Descriptografada</h3>

          <div className="resultado-item">
            <label>Mensagem Original:</label>
            <div className="valor">{resultado.mensagemOriginal}</div>
          </div>

          <div className="aviso">
            Aviso: {resultado.aviso}
          </div>
        </div>
      )}
    </div>
  );
}

export default Descriptografar;
