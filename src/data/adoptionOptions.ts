export const LIVES_ALONE = "Moro sozinho(a)";

export const residenceOptions = [
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "chacara", label: "Chácara" },
  { value: "sitio", label: "Sítio" },
];

export const householdOptions = [
  LIVES_ALONE,
  "Cônjuge ou parceiro(a)",
  "Filhos",
  "Pais",
  "Avós",
  "Irmãos",
  "Outros parentes",
  "Amigos ou colegas",
];

export const childrenAgeOptions = [
  { value: "0-2", label: "0-2 anos" },
  { value: "3-5", label: "3-5 anos" },
  { value: "6-10", label: "6-10 anos" },
  { value: "11-15", label: "11-15 anos" },
  { value: "16+", label: "16+ anos" },
  { value: "variadas", label: "Idades variadas" },
];

export const petSexOptions = [
  { value: "machos", label: "Machos" },
  { value: "femeas", label: "Fêmeas" },
  { value: "ambos", label: "Ambos" },
];

export const petAgeOptions = [
  "Filhotes",
  "Adultos",
  "Idosos",
  "Idades variadas",
];

export const petBehaviorOptions = [
  "Dócil",
  "Brincalhão",
  "Calmo",
  "Agitado",
  "Medroso",
  "Territorial",
  "Sociável com outros animais",
  "Sociável com pessoas",
];

export const availableTimeOptions = [
  {
    value: "fins-de-semana",
    label: "Fins de semana",
    description: "Tenho tempo livre só aos sábados e domingos",
  },
  {
    value: "poucas-horas",
    label: "Poucas horas",
    description: "Consigo dedicar algumas horas por dia",
  },
  {
    value: "meio-periodo",
    label: "Meio período",
    description: "Fico em casa boa parte do dia",
  },
  {
    value: "periodo-integral",
    label: "Integral",
    description: "Estou em casa quase o dia todo",
  },
];
