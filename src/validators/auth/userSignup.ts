interface UserSignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const validateUserSignupForm = (formData: UserSignupFormData): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (!formData.firstName.trim()) {
    newErrors.firstName = "Nome é obrigatório";
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Sobrenome é obrigatório";
  }

  if (!formData.email.trim()) {
    newErrors.email = "E-mail é obrigatório";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "E-mail inválido";
  }

  if (!formData.password) {
    newErrors.password = "Senha é obrigatória";
  } else if (formData.password.length < 8) {
    newErrors.password = "Senha deve ter pelo menos 8 caracteres";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Senhas não coincidem";
  }

  if (!formData.agreeToTerms) {
    newErrors.agreeToTerms = "Você deve aceitar os termos de uso";
  }

  return newErrors;
};

export type { UserSignupFormData };