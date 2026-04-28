// ========================================
// Componente Principal da Aplicação
// ========================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Criptografar from './pages/Criptografar';
import Descriptografar from './pages/Descriptografar';
import Navbar from './components/Navbar';
import './App.css';

// Componente que protege rotas - só permite acesso se o usuário estiver logado
function RotaProtegida({ children }) {
  const { token } = useAuth();
  // Se não tem token, redireciona para o login
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="conteudo-principal">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />

              {/* Rotas protegidas (precisa estar logado) */}
              <Route path="/criptografar" element={
                <RotaProtegida><Criptografar /></RotaProtegida>
              } />
              <Route path="/descriptografar" element={
                <RotaProtegida><Descriptografar /></RotaProtegida>
              } />

              {/* Qualquer rota desconhecida redireciona para o login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
