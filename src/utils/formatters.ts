export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7
    )}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
    7,
    11
  )}`;
};

export const formatCnpj = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
      5,
      8
    )}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
    5,
    8
  )}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

export const formatCpf = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
    6,
    9
  )}-${numbers.slice(9, 11)}`;
};

export const formatCep = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = [
    { label: "ano", seconds: 31536000 },
    { label: "mês", seconds: 2592000 },
    { label: "semana", seconds: 604800 },
    { label: "dia", seconds: 86400 },
    { label: "hora", seconds: 3600 },
    { label: "minuto", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `há ${count} ${interval.label}${count > 1 ? "s" : ""}`;
    }
  }

  return "agora";
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
};

export const formatName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
};

export const formatInitials = (firstName: string, lastName: string): string => {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  return `${first}${last}`;
};

export const formatEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const formatUrlParam = (text: string): string => {
  return encodeURIComponent(text);
};

export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const removeFormatting = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatAge = (birthDate: string | Date): string => {
  if (!birthDate) return "";

  const birth = new Date(birthDate);
  const now = new Date();

  const totalDays = Math.floor(
    (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (totalDays < 30) {
    return totalDays === 1 ? "1 dia" : `${totalDays} dias`;
  }

  if (totalDays < 365) {
    const months = Math.floor(totalDays / 30);
    return months === 1 ? "1 mês" : `${months} meses`;
  }

  const years = Math.floor(totalDays / 365);
  return years === 1 ? "1 ano" : `${years} anos`;
};
