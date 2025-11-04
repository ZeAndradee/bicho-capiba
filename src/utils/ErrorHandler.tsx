interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface ErrorState {
  message: string;
  fieldErrors?: Record<string, string>;
}

export const handleApiError = (
  error: unknown,
  customErrorMessages?: Record<number, string>
): ErrorState => {
  const defaultMessage = "Ocorreu um erro inesperado. Tente novamente.";

  const defaultStatusMessages: Record<number, string> = {
    400: "Dados inválidos. Verifique as informações e tente novamente.",
    401: "Acesso negado. Faça login novamente.",
    403: "Você não tem permissão para realizar esta ação.",
    404: "Ocorreu um erro inesperado. Tente novamente em alguns minutos.",
    409: "Conflito nos dados. Verifique se as informações já existem.",
    422: "Dados inválidos. Verifique os campos e tente novamente.",
    429: "Muitas tentativas. Aguarde um momento e tente novamente.",
    500: "Ocorreu um erro inesperado. Tente novamente em alguns minutos.",
    502: "Serviço temporariamente indisponível.",
    503: "Serviço em manutenção. Tente novamente mais tarde.",
  };

  const apiError = error as ApiError;

  if (!apiError.response) {
    return { message: defaultMessage };
  }

  const { status } = apiError.response;

  if (customErrorMessages && status && customErrorMessages[status]) {
    return { message: customErrorMessages[status] };
  }

  if (status && defaultStatusMessages[status]) {
    return { message: defaultStatusMessages[status] };
  }

  return { message: defaultMessage };
};
