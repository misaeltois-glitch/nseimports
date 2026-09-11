/** Preenchimento automático de endereço a partir do CEP (BRIEF.md, seção 06 — Sacola e checkout). */
export interface AddressFromCep {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function isValidCep(cep: string): boolean {
  return /^\d{8}$/.test(cep.replace(/\D/g, ""));
}

export async function fetchAddressByCep(cep: string): Promise<AddressFromCep | null> {
  const digits = cep.replace(/\D/g, "");
  if (!isValidCep(digits)) return null;

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) return null;

  const data = await response.json();
  if (data.erro) return null;

  return {
    street: data.logradouro ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    state: data.uf ?? "",
  };
}
