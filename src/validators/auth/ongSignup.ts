interface OngSignupFormData {
  name: string;
  cnpj: string;
  email: string;
  telefone: string;
  descricao: string;
  bairro: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  complemento: string;
  CEP: string;
  quantidadeAnimais: number;
  responsavelTecnico: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const validateOngSignupStep = (
  formData: OngSignupFormData,
  step: number
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (step === 1) {
    // name validation (3-80 chars)
    if (!formData.name.trim()) {
      newErrors.name = "name da ONG é obrigatório";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "name deve ter pelo menos 3 caracteres";
    } else if (formData.name.trim().length > 80) {
      newErrors.name = "name deve ter no máximo 80 caracteres";
    }

    // CNPJ validation (14-18 chars including formatting)
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else {
      const cleanCnpj = formData.cnpj.replace(/\D/g, "");
      if (cleanCnpj.length !== 14) {
        newErrors.cnpj = "CNPJ deve ter 14 dígitos";
      } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
        newErrors.cnpj = "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX";
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    // Telefone validation (10-11 chars)
    if (!formData.telefone.trim()) {
      newErrors.telefone = "Celular é obrigatório";
    } else {
      const cleanPhone = formData.telefone.replace(/\D/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        newErrors.telefone = "Celular deve ter 10 ou 11 dígitos";
      }
    }

    // Descricao validation (required, max 500 chars)
    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    } else if (formData.descricao.length > 500) {
      newErrors.descricao = "Descrição deve ter no máximo 500 caracteres";
    }
  }

  if (step === 2) {
    // CEP validation (8-9 chars)
    if (formData.CEP && formData.CEP.trim()) {
      const cleanCep = formData.CEP.replace(/\D/g, "");
      if (cleanCep.length !== 8) {
        newErrors.CEP = "CEP deve ter 8 dígitos";
      }
    }

    // Address field validations (max 255 chars each)
    if (formData.bairro && formData.bairro.length > 255) {
      newErrors.bairro = "Bairro deve ter no máximo 255 caracteres";
    }

    if (formData.rua && formData.rua.length > 255) {
      newErrors.rua = "Rua deve ter no máximo 255 caracteres";
    }

    if (formData.numero && formData.numero.length > 20) {
      newErrors.numero = "Número deve ter no máximo 20 caracteres";
    }

    if (formData.cidade && formData.cidade.length > 255) {
      newErrors.cidade = "Cidade deve ter no máximo 255 caracteres";
    }

    if (formData.estado && formData.estado.length > 2) {
      newErrors.estado = "Estado deve ter no máximo 2 caracteres";
    }

    if (formData.complemento && formData.complemento.length > 255) {
      newErrors.complemento = "Complemento deve ter no máximo 255 caracteres";
    }
  }

  if (step === 3) {
    // ResponsavelTecnico validation (max 255 chars)
    if (!formData.responsavelTecnico.trim()) {
      newErrors.responsavelTecnico = "Responsável técnico é obrigatório";
    } else if (formData.responsavelTecnico.length > 255) {
      newErrors.responsavelTecnico =
        "Responsável técnico deve ter no máximo 255 caracteres";
    }

    // Password validation (6-255 chars)
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    } else if (formData.password.length > 255) {
      newErrors.password = "Senha deve ter no máximo 255 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    // QuantidadeAnimais validation (min 0)
    if (formData.quantidadeAnimais < 0) {
      newErrors.quantidadeAnimais =
        "Quantidade de animais não pode ser negativa";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Você deve aceitar os termos de uso";
    }
  }

  return newErrors;
};

export type { OngSignupFormData };
