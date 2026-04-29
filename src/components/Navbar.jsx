// ========================================
// Componente Navbar (Barra de Navegação)
// ========================================
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, usuario, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Logo do sistema */}
      <div className="navbar-logo">
        CifraCesar
      </div>

      <div className="navbar-links">
        {/* Se estiver logado, mostra as opções de criptografia */}
        {token ? (
          <>
            <Link
              to="/criptografar"
              className={location.pathname === '/criptografar' ? 'active' : ''}
            >
              Criptografar
            </Link>
            <Link
              to="/descriptografar"
              className={location.pathname === '/descriptografar' ? 'active' : ''}
            >
              Descriptografar
            </Link>
            <span className="usuario-info">Olá, {usuario}</span>
            <button className="btn-logout" onClick={logout}>
              Sair
            </button>
          </>
        ) : (
          <>
            {/* Se não estiver logado, mostra login e cadastro */}
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Login
            </Link>
            <Link
              to="/cadastro"
              className={location.pathname === '/cadastro' ? 'active' : ''}
            >
              Cadastro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
