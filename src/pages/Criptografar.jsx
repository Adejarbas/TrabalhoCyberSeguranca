// ========================================
// Tela de Criptografar Mensagem
// ========================================
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Criptografar() {
  const [mensagem, setMensagem] = useState('');
  const [passo, setPasso] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { token } = useAuth();

  // Envia a mensagem e o passo para o backend criptografar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3001/api/criptografar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o JWT para autenticação
        },
        body: JSON.stringify({ mensagem, passo: parseInt(passo) })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao criptografar');
        return;
      }

      // Exibe o resultado com a mensagem criptografada e o hash
      setResultado(dados);
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card card-largo">
      <h2>Criptografar</h2>
      <p className="card-subtitulo">Cifra de César - Criptografar mensagem</p>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label htmlFor="mensagem">Mensagem a criptografar</label>
          <textarea
            id="mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite a mensagem que deseja criptografar..."
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="passo">
            Passo (deslocamento da cifra)
          </label>
          <input
            id="passo"
            type="number"
            value={passo}
            onChange={(e) => setPasso(e.target.value)}
            placeholder="Ex: 3 (desloca 3 posições)"
            required
          />
          <span className="dica-campo">
            Positivo = desloca para frente | Negativo = desloca para trás
          </span>
        </div>

        <button type="submit" className="btn-principal" disabled={carregando}>
          {carregando ? 'Criptografando...' : 'Criptografar'}
        </button>
      </form>

      {/* Exibe o resultado após criptografar */}
      {resultado && (
        <div className="resultado-box">
          <h3>Resultado da Criptografia</h3>

          <div className="resultado-item">
            <label>Mensagem Criptografada:</label>
            <div className="valor">{resultado.mensagemCriptografada}</div>
          </div>

          <div className="resultado-item">
            <label>Hash (Chave Privada):</label>
            <div className="valor hash">{resultado.hashChave}</div>
          </div>

          <div className="aviso">
            Aviso: {resultado.aviso}
          </div>
        </div>
      )}
    </div>
  );
}

export default Criptografar;
