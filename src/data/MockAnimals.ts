export interface Animal {
  id: string;
  nome: string;
  image: string;
  sexo: "M" | "F";
  idade: number;
  especie: string;
  raca: string;
  distance: string;
  neighborhood: string;
  city: string;
}

export const mockAnimals: Animal[] = [
  {
    id: "1",
    nome: "Bolt",
    image:
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop",
    sexo: "M",
    idade: 2,
    especie: "dog",
    raca: "Golden Retriever",
    distance: "0.7 km",
    neighborhood: "Imbiribeira",
    city: "Recife",
  },
  {
    id: "2",
    nome: "Luna",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
    sexo: "F",
    idade: 1,
    especie: "dog",
    raca: "Vira-lata",
    distance: "1.2 km",
    neighborhood: "Boa Viagem",
    city: "Recife",
  },
  {
    id: "3",
    nome: "Max",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    sexo: "M",
    idade: 3,
    especie: "dog",
    raca: "Labrador",
    distance: "2.1 km",
    neighborhood: "Pina",
    city: "Recife",
  },
  {
    id: "4",
    nome: "Mia",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    sexo: "F",
    idade: 0,
    especie: "cat",
    raca: "Persa",
    distance: "0.5 km",
    neighborhood: "Setúbal",
    city: "Recife",
  },
  {
    id: "5",
    nome: "Rex",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    sexo: "M",
    idade: 4,
    especie: "dog",
    raca: "Pastor Alemão",
    distance: "3.2 km",
    neighborhood: "Casa Forte",
    city: "Recife",
  },
  {
    id: "6",
    nome: "Bella",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
    sexo: "F",
    idade: 2,
    especie: "dog",
    raca: "Border Collie",
    distance: "1.8 km",
    neighborhood: "Graças",
    city: "Recife",
  },
  {
    id: "7",
    nome: "Serpentina",
    image:
      "https://images.unsplash.com/photo-1651093161533-76e8cfedb83b?w=400&h=300&fit=crop",
    sexo: "F",
    idade: 1,
    especie: "bird",
    raca: "Cobra",
    distance: "2.5 km",
    neighborhood: "Madalena",
    city: "Recife",
  },
  {
    id: "8",
    nome: "Pipoca",
    image:
      "https://images.unsplash.com/photo-1512087499053-023f060e2cea?w=400&h=300&fit=crop",
    sexo: "M",
    idade: 0,
    especie: "rabbit",
    raca: "Porquinho-da-índia",
    distance: "1.1 km",
    neighborhood: "Aflitos",
    city: "Recife",
  },
];
