interface AdoptionFormData {
  tipo_residencia: string;
  area_externa: boolean | null;
  tela_protetora: boolean | null;
  composicao_familiar: string;
  quantidade_moradores: string;
  possui_criancas: boolean | null;
  quantidade_criancas: string;
  faixa_etaria_criancas: string;
  crianca_necessidade_especial: boolean | null;
  tipo_necessidade_criancas: string;
  familiar_necessidade_especial: boolean | null;
  tipo_necessidade_especial_familiar: string;
  possui_animais: boolean | null;
  quantidade_animais: string;
  idade_animais: string;
  sexo_animais: string;
  experiencia_com_animais: boolean | null;
  comportamento_animais: string;
  conhecimento_despesas_animais: boolean | null;
  tempo_disponivel: string;
}

export const validateAdoptionForm = (
  formData: AdoptionFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.tipo_residencia.trim()) {
    errors.tipo_residencia = "Tipo de residência é obrigatório";
  }

  if (formData.area_externa === null) {
    errors.area_externa = "Informe se possui área externa";
  }

  if (formData.tela_protetora === null) {
    errors.tela_protetora = "Informe se possui tela protetora";
  }

  if (!formData.composicao_familiar.trim()) {
    errors.composicao_familiar = "Composição familiar é obrigatória";
  }

  if (!formData.quantidade_moradores || !formData.quantidade_moradores.trim()) {
    errors.quantidade_moradores = "Quantidade de moradores é obrigatória";
  }

  if (formData.possui_criancas === null) {
    errors.possui_criancas = "Informe se possui crianças";
  }

  if (formData.possui_criancas === true) {
    if (!formData.quantidade_criancas || !formData.quantidade_criancas.trim()) {
      errors.quantidade_criancas = "Quantidade de crianças é obrigatória";
    }

    if (!formData.faixa_etaria_criancas.trim()) {
      errors.faixa_etaria_criancas = "Faixa etária das crianças é obrigatória";
    }

    if (formData.crianca_necessidade_especial === null) {
      errors.crianca_necessidade_especial =
        "Informe se alguma criança possui necessidade especial";
    }

    if (
      formData.crianca_necessidade_especial === true &&
      !formData.tipo_necessidade_criancas.trim()
    ) {
      errors.tipo_necessidade_criancas =
        "Informe o tipo de necessidade especial da criança";
    }
  }

  if (formData.familiar_necessidade_especial === null) {
    errors.familiar_necessidade_especial =
      "Informe se algum familiar possui necessidade especial";
  }

  if (
    formData.familiar_necessidade_especial === true &&
    !formData.tipo_necessidade_especial_familiar.trim()
  ) {
    errors.tipo_necessidade_especial_familiar =
      "Informe o tipo de necessidade especial do familiar";
  }

  if (formData.possui_animais === null) {
    errors.possui_animais = "Informe se possui outros animais";
  }

  if (formData.possui_animais === true) {
    if (!formData.quantidade_animais || !formData.quantidade_animais.trim()) {
      errors.quantidade_animais = "Quantidade de animais é obrigatória";
    }

    if (!formData.idade_animais.trim()) {
      errors.idade_animais = "Idade dos animais é obrigatória";
    }

    if (!formData.sexo_animais.trim()) {
      errors.sexo_animais = "Sexo dos animais é obrigatório";
    }
  }

  if (formData.experiencia_com_animais === null) {
    errors.experiencia_com_animais =
      "Informe se possui experiência com animais";
  }

  if (!formData.comportamento_animais.trim()) {
    errors.comportamento_animais = "Comportamento dos animais é obrigatório";
  }

  if (formData.conhecimento_despesas_animais === null) {
    errors.conhecimento_despesas_animais =
      "Informe se tem conhecimento sobre despesas com animais";
  }

  if (!formData.tempo_disponivel.trim()) {
    errors.tempo_disponivel = "Tempo disponível é obrigatório";
  }

  return errors;
};

export type { AdoptionFormData };
