// ========================================
// Contexto de Autenticação (React Context API)
// ========================================
// Gerencia o estado de login do usuário em toda a aplicação
import { createContext, useContext, useState } from 'react';

// Cria o contexto
const AuthContext = createContext();

// Provider que envolve toda a aplicação
export function AuthProvider({ children }) {
  // Recupera token e usuário do localStorage (mantém login ao recarregar)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario'));

  // Função chamada ao fazer login com sucesso
  const login = (novoToken, nomeUsuario) => {
    localStorage.setItem('token', novoToken);
    localStorage.setItem('usuario', nomeUsuario);
    setToken(novoToken);
    setUsuario(nomeUsuario);
  };

  // Função chamada ao fazer logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}
