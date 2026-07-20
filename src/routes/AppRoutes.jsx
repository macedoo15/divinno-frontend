import { Routes, Route } from 'react-router-dom';
import Cadastro from '../pages/Cadastro';
import Login from '../pages/Admin/Login';
import Dashboard from '../pages/Admin/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Cadastro />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
