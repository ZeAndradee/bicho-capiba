interface AnimalFormData {
  nome: string;
  sexo: string;
  porte?: string;
  cor: string;
  especie: string;
  raca: string;
  data_nascimento?: string;
  vacinas?: string[];
  castrado?: boolean;
  necessidades_especiais?: string;
  historia?: string;
  sociavel_animal?: boolean;
  sociavel_pessoa?: boolean;
  images?: File[];
}

export const validateAnimalForm = (
  formData: AnimalFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.nome.trim()) {
    errors.nome = "Nome é obrigatório";
  } else if (formData.nome.trim().length < 1) {
    errors.nome = "Nome deve ter pelo menos 1 caractere";
  } else if (formData.nome.trim().length > 100) {
    errors.nome = "Nome deve ter no máximo 100 caracteres";
  }

  if (!formData.sexo) {
    errors.sexo = "Sexo é obrigatório";
  } else if (!["M", "F"].includes(formData.sexo)) {
    errors.sexo = "Sexo deve ser M (Macho) ou F (Fêmea)";
  }

  if (formData.porte && !["Pequeno", "Medio", "Grande"].includes(formData.porte)) {
    errors.porte = "Porte deve ser Pequeno, Medio ou Grande";
  }

  if (!formData.cor.trim()) {
    errors.cor = "Cor é obrigatória";
  } else if (formData.cor.length > 50) {
    errors.cor = "Cor deve ter no máximo 50 caracteres";
  }

  if (!formData.especie.trim()) {
    errors.especie = "Espécie é obrigatória";
  } else if (formData.especie.length > 50) {
    errors.especie = "Espécie deve ter no máximo 50 caracteres";
  }

  if (!formData.raca.trim()) {
    errors.raca = "Raça é obrigatória";
  } else if (formData.raca.length > 50) {
    errors.raca = "Raça deve ter no máximo 50 caracteres";
  }

  if (formData.data_nascimento && formData.data_nascimento.length > 10) {
    errors.data_nascimento =
      "Data de nascimento deve ter no máximo 10 caracteres";
  } else if (formData.data_nascimento) {
    const birthDate = new Date(formData.data_nascimento);
    const today = new Date();
    if (birthDate > today) {
      errors.data_nascimento = "Data de nascimento não pode ser no futuro";
    }
  }

  if (
    formData.necessidades_especiais &&
    formData.necessidades_especiais.length > 200
  ) {
    errors.necessidades_especiais =
      "Necessidades especiais deve ter no máximo 200 caracteres";
  }

  if (formData.historia && formData.historia.length > 1000) {
    errors.historia = "História deve ter no máximo 1000 caracteres";
  }

  return errors;
};

export type { AnimalFormData };
