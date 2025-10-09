export interface Animal {
  id: string;
  name: string;
  image: string;
  gender: "male" | "female";
  age: string;
  species: "dog" | "cat" | "horse" | "bird" | "rabbit";
  breed: string;
  distance: string;
  neighborhood: string;
  city: string;
}

export const mockAnimals: Animal[] = [
  {
    id: "1",
    name: "Bolt",
    image:
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop",
    gender: "male",
    age: "2 anos",
    species: "dog",
    breed: "Golden Retriever",
    distance: "0.7 km",
    neighborhood: "Imbiribeira",
    city: "Recife",
  },
  {
    id: "2",
    name: "Luna",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
    gender: "female",
    age: "1 ano",
    species: "dog",
    breed: "Vira-lata",
    distance: "1.2 km",
    neighborhood: "Boa Viagem",
    city: "Recife",
  },
  {
    id: "3",
    name: "Max",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    gender: "male",
    age: "3 anos",
    species: "dog",
    breed: "Labrador",
    distance: "2.1 km",
    neighborhood: "Pina",
    city: "Recife",
  },
  {
    id: "4",
    name: "Mia",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    gender: "female",
    age: "6 meses",
    species: "cat",
    breed: "Persa",
    distance: "0.5 km",
    neighborhood: "Setúbal",
    city: "Recife",
  },
  {
    id: "5",
    name: "Rex",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    gender: "male",
    age: "4 anos",
    species: "dog",
    breed: "Pastor Alemão",
    distance: "3.2 km",
    neighborhood: "Casa Forte",
    city: "Recife",
  },
  {
    id: "6",
    name: "Bella",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
    gender: "female",
    age: "2 anos",
    species: "dog",
    breed: "Border Collie",
    distance: "1.8 km",
    neighborhood: "Graças",
    city: "Recife",
  },
  {
    id: "7",
    name: "Serpentina",
    image:
      "https://images.unsplash.com/photo-1651093161533-76e8cfedb83b?w=400&h=300&fit=crop",
    gender: "female",
    age: "1 ano",
    species: "bird",
    breed: "Cobra",
    distance: "2.5 km",
    neighborhood: "Madalena",
    city: "Recife",
  },
  {
    id: "8",
    name: "Pipoca",
    image:
      "https://images.unsplash.com/photo-1512087499053-023f060e2cea?w=400&h=300&fit=crop",
    gender: "male",
    age: "8 meses",
    species: "rabbit",
    breed: "Porquinho-da-índia",
    distance: "1.1 km",
    neighborhood: "Aflitos",
    city: "Recife",
  },
];
