import api from './api';

export async function loginAdmin(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  const token = data?.token || data?.accessToken || data?.access_token;

  if (!token) {
    throw new Error('Login realizado, mas a API nao retornou token.');
  }

  localStorage.setItem('divinno:token', token);
  return data;
}

export async function listarClientes() {
  const { data } = await api.get('/clientes');
  return Array.isArray(data) ? data : data?.clientes || data?.data || [];
}

export function logoutAdmin() {
  localStorage.removeItem('divinno:token');
}

export function isAdminAuthenticated() {
  return Boolean(localStorage.getItem('divinno:token'));
}
