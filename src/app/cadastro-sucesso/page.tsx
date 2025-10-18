"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/UI/Button/Button";
import { FaArrowRight } from "react-icons/fa";
import styles from "./page.module.css";

function CadastroSucessoContent() {
  const searchParams = useSearchParams();
  const nomeOng = searchParams.get("nome") || "ONG";
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <div className={styles.successImage}>
            <Image
              src="/images/OngSuccess.png"
              alt="ONG Success"
              width={200}
              height={200}
              priority
            />
          </div>
          <h1 className={styles.title}>{nomeOng}</h1>
          <h2 className={styles.subtitle}>
            Sua ONG foi cadastrada com sucesso!
          </h2>
          <p className={styles.description}>
            Agora que a sua ONG está registrada na nossa plataforma, vamos
            continuar configurando seu perfil.
          </p>
          <div className={styles.actions}>
            <Link href="/perfil">
              <Button variant="outline" color="green" size="large">
                Ir para o Perfil
              </Button>
            </Link>
            <Link href="/animais/adicionar">
              <Button
                variant="primary"
                color="green"
                size="large"
                icon={<FaArrowRight />}
                iconPosition="right"
              >
                Continuar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CadastroSucesso() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CadastroSucessoContent />
    </Suspense>
  );
}
