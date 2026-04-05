import { useState, useEffect } from 'react'
import Colaboradores from './components/Colaboradores'
import Escala from './components/Escala'
import Fechamento from './components/Fechamento'
import Login from './components/Login'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [aba, setAba] = useState('colaboradores')

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      <header className="header-top">
        <div className="header-user">
          <span className="header-user-name">Administrador Geral</span>
          <span className="header-user-cpf">Gestão de Escalas Central</span>
        </div>
        <button className="btn-sair" onClick={handleLogout}>Sair</button>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${aba === 'colaboradores' ? 'active' : ''}`}
          onClick={() => setAba('colaboradores')}
        >
          Colaboradores
        </button>
        <button
          className={`tab ${aba === 'escala' ? 'active' : ''}`}
          onClick={() => setAba('escala')}
        >
          Escala Semanal
        </button>
        <button
          className={`tab ${aba === 'fechamento' ? 'active' : ''}`}
          onClick={() => setAba('fechamento')}
        >
          Fechamento Mensal
        </button>
      </nav>

      <main className="app-main">
        {aba === 'colaboradores' && <Colaboradores />}
        {aba === 'escala' && <Escala />}
        {aba === 'fechamento' && <Fechamento />}
      </main>
    </div>
  )
}

export default App
