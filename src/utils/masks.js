/**
 * Formata um valor digitado no padrão (11) 99999-9999 enquanto o usuário digita.
 */
export function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, '($1');
  if (digits.length <= 7) return digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

/** Remove tudo que não é dígito. */
export function unmaskPhone(value) {
  return value.replace(/\D/g, '');
}
