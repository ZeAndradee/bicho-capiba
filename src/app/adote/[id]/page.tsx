"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AnimalHero from "@/components/Animal/AnimalHero/AnimalHero";
import AnimalInfo from "@/components/Animal/AnimalInfo/AnimalInfo";
import AnimalSkeleton from "@/components/UI/Skeletons/AnimalSkeleton/AnimalSkeleton";
import { fetchAnimalById } from "@/services/Animals/Animal";
import styles from "./page.module.css";
import { formatAge } from "@/utils/formatters";

interface ApiAnimal {
  uuid: string;
  nome: string;
  sexo: "M" | "F";
  porte: string;
  cor: string;
  especie: string;
  raca: string;
  dataNascimento: string;
  vacinas: string;
  castrado: number;
  necessidadesEspeciais: string | null;
  historia: string;
  statusAnimal: string;
  sociavelAnimal: number;
  sociavelPessoa: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  ong: {
    nome: string;
    email: string;
    telefone: string;
  };
  fotos: Array<{
    url: string;
  }>;
}

interface Animal {
  id: string;
  nome: string;
  images: string[];
  sexo: "M" | "F";
  idade: string;
  raca: string;
  distancia: string;
  bairroOng: string;
  cidadeOng: string;
  descricao: string;
  historia: string;
  castrado: boolean;
}

interface Ong {
  nome: string;
  endereco: string;
  telefone: string;
  imagem: string;
}

const transformApiData = (apiData: ApiAnimal): { animal: Animal; ong: Ong } => {
  const animal: Animal = {
    id: apiData.uuid,
    nome: apiData.nome,
    images:
      apiData.fotos.length > 0
        ? apiData.fotos.map((foto) => foto.url)
        : ["/icons/capibaCrabOrange.svg"],
    sexo: apiData.sexo,
    idade: formatAge(apiData.dataNascimento),
    raca: apiData.raca,
    distancia: "N/A",
    bairroOng: "N/A",
    cidadeOng: "N/A",
    descricao: apiData.historia || "Sem descrição disponível",
    historia: apiData.historia || "Sem história disponível",
    castrado: apiData.castrado === 1,
  };

  const ong: Ong = {
    nome: apiData.ong.nome,
    endereco: "Endereço não disponível",
    telefone: apiData.ong.telefone,
    imagem: "/icons/capibaCrabOrange.svg",
  };

  return { animal, ong };
};

export default function AnimalProfile() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const animalId = params.id as string;
  const isRedirected = searchParams.get("redirected") === "true";
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [ong, setOng] = useState<Ong | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnimal = async () => {
      setLoading(true);

      try {
        const response = await fetchAnimalById(animalId);
        const { animal: transformedAnimal, ong: transformedOng } =
          transformApiData(response.result);
        setAnimal(transformedAnimal);
        setOng(transformedOng);
      } catch (error) {
        console.error("Error loading animal:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
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
      <AnimalInfo animal={animal} ong={ong} shouldOpenModal={isRedirected} />
    </div>
  );
}
