import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo')
    .max(120, 'Nome muito longo'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail')
    .email('E-mail inválido'),
  dataNascimento: z
    .string()
    .min(1, 'Informe sua data de nascimento')
    .refine((value) => new Date(value) <= new Date(), 'Data inválida'),
  whatsapp: z
    .string()
    .min(1, 'Informe seu WhatsApp')
    .refine((value) => value.replace(/\D/g, '').length >= 10, 'Número incompleto'),
});
