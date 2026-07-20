import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroSchema } from '../pages/Cadastro/cadastroSchema';
import { cadastrarCliente } from '../services/clientesService';
import { unmaskPhone } from '../utils/masks';

export function useCadastroForm() {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);

  const form = useForm({
    resolver: zodResolver(cadastroSchema),
    mode: 'onBlur',
    defaultValues: {
      nome: '',
      email: '',
      dataNascimento: '',
      whatsapp: '',
    },
  });

  async function onSubmit(values) {
    setStatus('submitting');
    setServerError(null);
    try {
      await cadastrarCliente({
        ...values,
        whatsapp: unmaskPhone(values.whatsapp),
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(
        err?.response?.data?.message || 'Não foi possível concluir o cadastro. Tente novamente.'
      );
    }
  }

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
    status,
    serverError,
  };
}
