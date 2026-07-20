import { Routes, Route } from 'react-router-dom';
import Cadastro from '../pages/Cadastro';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Cadastro />} />
      {/*
        Próximas etapas (área administrativa):
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/clientes" element={<PrivateRoute><ListaClientes /></PrivateRoute>} />
      */}
    </Routes>
  );
}

export default AppRoutes;
