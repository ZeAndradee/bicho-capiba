"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AnimalHero from "@/components/Animal/AnimalHero/AnimalHero";
import AnimalInfo from "@/components/Animal/AnimalInfo/AnimalInfo";
import AnimalSkeleton from "@/components/UI/Skeletons/AnimalSkeleton/AnimalSkeleton";
import styles from "./page.module.css";

const mockAnimal = {
  id: "123",
  nome: "Belinha",
  images: [
    "/images/MockDog1.png",
    "/images/MockDog2.png",
    "/images/MockDog3.png",
    "/images/MockDog1.png",
    "/images/MockDog2.png",
    "/images/MockDog3.png",
  ],
  sexo: "F" as const,
  idade: 2,
  raca: "Labrador",
  distancia: "5km",
  bairroOng: "Centro",
  cidadeOng: "São Paulo",
  descricao: "Uma cachorrinha muito carinhosa e brincalhona...",
  historia:
    "Belinha foi encontrada na rua quando ainda era filhote, abandonada em uma caixa de papelão em um dia chuvoso de inverno. Ela chegou até nós muito assustada, desnutrida e com medo de qualquer movimento brusco.\n\nNos primeiros dias, ela se escondia em um canto do canil e não se aproximava de ninguém. Com muita paciência, amor e cuidado veterinário, Belinha começou a confiar novamente nas pessoas.\n\nAos poucos, descobrimos sua personalidade doce e brincalhona. Ela adora correr no quintal, brincar com bolinhas de tênis e fazer novos amigos caninos. Belinha é extremamente inteligente e aprendeu comandos básicos rapidamente.\n\nEla se dá muito bem com crianças e outros animais, sendo uma companheira ideal para famílias. Apesar de todo o trauma que passou, ela mantém um coração cheio de amor para dar.\n\nBelinha sonha em ter uma família que a ame incondicionalmente e que possa dar a ela a segurança que sempre mereceu. Ela está castrada, vacinada e pronta para começar uma nova vida cheia de alegria e carinho ao lado de pessoas especiais que saibam valorizar sua doçura única.",
  castrado: true,
};

const mockOng = {
  nome: "Amigos dos Animais SP",
  endereco: "Rua da Aurora, Recife, PE",
  telefone: "(11) 9999-9999",
  imagem: "/icons/capibaCrabOrange.svg",
};

export default function AnimalProfile() {
  const params = useParams();
  const router = useRouter();
  const animalId = params.id as string;
  const [animal, setAnimal] = useState<typeof mockAnimal | null>(null);
  const [ong, setOng] = useState<typeof mockOng | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnimal = async () => {
      setLoading(true);

      setTimeout(async () => {
        try {
          // const animalData = await fetchAnimalById(animalId);
          // setAnimal(animalData.animal);
          // setOng(animalData.ong);

          setAnimal(mockAnimal);
          setOng(mockOng);
        } catch (error) {
          console.error("Error loading animal:", error);
          router.push("/404");
        } finally {
          setLoading(false);
        }
      }, 2000);
    };

    if (animalId) {
      loadAnimal();
    }
  }, [animalId, router]);

  if (loading) {
    return <AnimalSkeleton />;
  }

  return (
    <div className={styles.page}>
      <AnimalHero animal={animal} />
      <AnimalInfo animal={animal} ong={ong} />
    </div>
  );
}
