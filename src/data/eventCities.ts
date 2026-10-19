export const CONECTA_RECIFE_CASTRAMOVEL_URL =
  "https://conecta.recife.pe.gov.br/redirecionamento/servico/34";

export interface EventCityProgram {
  description: string;
  bookingLabel: string;
  bookingUrl: string;
  sourceName: string;
}

export interface EventCity {
  slug: string;
  name: string;
  label: string;
  state: string;
  heroImage?: string;
  program?: EventCityProgram;
  newsKeywords: string[];
}

export const eventCities: EventCity[] = [
  {
    slug: "recife",
    name: "Recife",
    label: "recife",
    state: "PE",
    heroImage: "/images/RecifeHero.webp",
    program: {
      description:
        "Agenda do Castramóvel da Prefeitura do Recife: castração gratuita de cães e gatos rodando pelos bairros da cidade. O agendamento é feito pelo Conecta Recife.",
      bookingLabel: "Agendar no Conecta Recife",
      bookingUrl: CONECTA_RECIFE_CASTRAMOVEL_URL,
      sourceName: "Conecta Recife",
    },
    newsKeywords: ["Recife", "recifense"],
  },
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    label: "rio de janeiro",
    state: "RJ",
    heroImage: "/images/RioDeJaneiroHero.webp",
    newsKeywords: [
      "Rio de Janeiro",
      "Cidade do Rio",
      "no Rio",
      "do Rio",
      "Rio terá",
      "Rio promove",
      "Rio realiza",
      "Rio conclui",
      "carioca",
      "RJPET",
    ],
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    label: "são paulo",
    state: "SP",
    heroImage: "/images/SaoPauloHero.webp",
    newsKeywords: [
      "São Paulo",
      "capital paulista",
      "paulistano",
      "paulistana",
    ],
  },
];

export const getEventCity = (slug: string) =>
  eventCities.find((city) => city.slug === slug);

export const eventCategoryLabels = {
  castracao: "Castração gratuita",
  vacinacao: "Vacinação",
  adocao: "Feira de adoção",
};
