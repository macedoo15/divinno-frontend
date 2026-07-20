import api from './api';

/**
 * Envia o cadastro de um novo cliente para a API.
 * @param {{ nome: string, email: string, whatsapp: string, dataNascimento: string }} payload
 */
export async function cadastrarCliente(payload) {
  const { data } = await api.post('/clientes', payload);
  return data;
}
