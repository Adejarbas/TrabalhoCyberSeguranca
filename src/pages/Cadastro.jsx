// ========================================
// Tela de Cadastro de Usuário
// ========================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Cadastro() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // Envia os dados de cadastro para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Verifica se as senhas conferem
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem!');
      return;
    }

    // Verifica tamanho mínimo da senha
    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3001/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao cadastrar');
        return;
      }

      setSucesso('Cadastro realizado! Redirecionando para o login...');

      // Redireciona para o login após 2 segundos
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card">
      <div className="icone-pagina">📝</div>
      <h2>Cadastro</h2>
      <p className="card-subtitulo">Crie sua conta no sistema</p>

      {erro && <div className="mensagem-erro">{erro}</div>}
      {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Escolha um nome de usuário"
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Crie uma senha (mín. 4 caracteres)"
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="confirmar-senha">Confirmar Senha</label>
          <input
            id="confirmar-senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Repita a senha"
            required
          />
        </div>

        <button type="submit" className="btn-principal" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p className="link-texto">
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}

export default Cadastro;
