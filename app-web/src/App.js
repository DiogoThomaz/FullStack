import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

// paginas
import Login from './pages/Login';
import ColaboradorHome from './pages/colaborador/ColaboradorHome';
import GestorHome from './pages/gestor/GestorHome';
import AddColaborador from './pages/gestor/AddColaborador';
import EditarPerfil from './pages/gestor/EditarPerfil';
import VerEquipe from './pages/gestor/VerEquipe';
import SolicitarFerias from './pages/gestor/SolicitarFerias';
import SolicitacoesSquad from './pages/gestor/SolicitacoesSquad';
import Logout from './pages/Logout';
import Dashboard from './pages/gestor/DashBoard';
import { ThemeProvider } from '@mui/material';
import theme from './components/theme/theme';
import Login2 from './pages/Login2';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login2/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/cadastro" element={<Cadastro/>} />
          <Route path="/colaborador" element={<ColaboradorHome/>} />
          <Route path="/gestor" element={<GestorHome/>} />
          <Route path="/gestor/novo-colaborador" element={<AddColaborador/>} />
          <Route path="/gestor/editar-perfil" element={<EditarPerfil/>} />
          <Route path="/gestor/ver-equipe" element={<VerEquipe/>} />
          <Route path="/gestor/solicitar-ferias" element={<SolicitarFerias/>} />
          <Route path="/gestor/solicitacoes-squad" element={<SolicitacoesSquad/>} />
          <Route path="/gestor/dashboard" element={<Dashboard/>} />
          <Route path="/colaborador/editar-perfil" element={<EditarPerfil/>} />
          <Route path="/colaborador/solicitar-ferias" element={<SolicitarFerias/>} />
          <Route path="/colaborador/solicitacoes" element={<SolicitacoesSquad/>} />
          <Route path="/sair" element={<Logout/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
