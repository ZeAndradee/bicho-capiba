"use client";

export const runtime = "edge";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/UI/Breadcrumb/Breadcrumb";
import AnimalHero from "@/components/Animal/AnimalHero/AnimalHero";
import AnimalInfo from "@/components/Animal/AnimalInfo/AnimalInfo";
import AnimalSkeleton from "@/components/UI/Skeletons/AnimalSkeleton/AnimalSkeleton";
import { fetchAnimalById } from "@/services/Animals/Animal";
import styles from "./page.module.css";
import { formatAge } from "@/utils/formatters";
import { formatDistance, getDistanceKm } from "@/utils/geo";
import { useUserLocation } from "@/hooks/useUserLocation";

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
    rua: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    complemento: string | null;
    latitude: string | null;
    longitude: string | null;
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
  statusAnimal: string;
}

interface Ong {
  nome: string;
  endereco: string;
  telefone: string;
  imagem: string;
  latitude: string | null;
  longitude: string | null;
}

const formatOngAddress = (ong: ApiAnimal["ong"]): string => {
  const street = [ong.rua, ong.numero].filter(Boolean).join(", ");
  const streetLine = [street, ong.complemento].filter(Boolean).join(" - ");
  const cityLine = [ong.cidade, ong.estado].filter(Boolean).join(" - ");
  const address = [streetLine, ong.bairro, cityLine]
    .filter(Boolean)
    .join(", ");

  return address || "Endereço não disponível";
};

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
    distancia: "",
    bairroOng: apiData.ong.bairro || "Não informado",
    cidadeOng: apiData.ong.cidade || "Não informado",
    descricao: apiData.historia || "Sem descrição disponível",
    historia: apiData.historia || "Sem história disponível",
    castrado: apiData.castrado === 1,
    statusAnimal: apiData.statusAnimal,
  };

  const ong: Ong = {
    nome: apiData.ong.nome,
    endereco: formatOngAddress(apiData.ong),
    telefone: apiData.ong.telefone,
    imagem: "/icons/capibaCrabOrange.svg",
    latitude: apiData.ong.latitude,
    longitude: apiData.ong.longitude,
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
  const { location } = useUserLocation();

  const animalWithDistance = useMemo(() => {
    if (!animal) return null;
    const distance = formatDistance(
      getDistanceKm(location, ong?.latitude, ong?.longitude)
    );
    return { ...animal, distancia: distance ?? "" };
  }, [animal, ong, location]);

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
      {animal && (
        <Breadcrumb
          className={styles.breadcrumb}
          items={[{ label: "Adote", href: "/adote" }, { label: animal.nome }]}
        />
      )}
      <AnimalHero animal={animalWithDistance} />
      <AnimalInfo
        animal={animalWithDistance}
        ong={ong}
        shouldOpenModal={isRedirected}
      />
    </div>
  );
}
