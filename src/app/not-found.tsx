import Image from "next/image";
import Link from "next/link";
import Button from "@/components/UI/Button/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/404Cat.png"
            alt="Gato astronauta perdido no espaço"
            width={400}
            height={400}
            priority
          />
        </div>
        <div className={styles.textContent}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Página não encontrada</h2>
          <p className={styles.description}>
            Ops! A página que você procura não existe. <br /> <br /> Esse
            gatinho não pode ser encontrado, mas você ainda pode voltar para a
            página inicial.
          </p>
          <Link href="/">
            <Button
              variant="primary"
              color="orange"
              size="large"
              iconPosition="left"
            >
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
