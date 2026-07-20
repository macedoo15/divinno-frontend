import { z } from 'zod';

function criarDataUtc(valor) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);

  if (!partes) return null;

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const data = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    data.getUTCFullYear() !== ano ||
    data.getUTCMonth() !== mes - 1 ||
    data.getUTCDate() !== dia
  ) {
    return null;
  }

  return data;
}

function criarHojeUtc() {
  const hoje = new Date();

  return new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));
}

function calcularIdade(dataNascimento, hoje = criarHojeUtc()) {
  const anoAtual = hoje.getUTCFullYear();
  const mesAtual = hoje.getUTCMonth();
  const diaAtual = hoje.getUTCDate();
  const anoNascimento = dataNascimento.getUTCFullYear();
  const mesNascimento = dataNascimento.getUTCMonth();
  const diaNascimento = dataNascimento.getUTCDate();

  let idade = anoAtual - anoNascimento;

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade -= 1;
  }

  return idade;
}

const dataNascimentoSchema = z
  .string()
  .min(1, 'Informe sua data de nascimento')
  .superRefine((valor, ctx) => {
    const data = criarDataUtc(valor);

    if (!data) {
      ctx.addIssue({
        code: 'custom',
        message: 'Data de nascimento invalida.',
      });
      return;
    }

    if (data > criarHojeUtc()) {
      ctx.addIssue({
        code: 'custom',
        message: 'A data de nascimento nao pode ser futura.',
      });
      return;
    }

    const idade = calcularIdade(data);

    if (idade < 18) {
      ctx.addIssue({
        code: 'custom',
        message: 'Precisa ser maior de 18 anos para se cadastrar.',
      });
      return;
    }

    if (idade > 120) {
      ctx.addIssue({
        code: 'custom',
        message: 'A idade maxima permitida para cadastro e de 120 anos.',
      });
    }
  });

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
    .email('E-mail invalido'),
  dataNascimento: dataNascimentoSchema,
  whatsapp: z
    .string()
    .min(1, 'Informe seu WhatsApp')
    .refine((value) => value.replace(/\D/g, '').length >= 10, 'Numero incompleto'),
});
