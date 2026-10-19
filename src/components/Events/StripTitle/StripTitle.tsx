import styles from "./StripTitle.module.css";

interface StripTitleProps {
  words: string[];
  size?: "large" | "medium";
}

export default function StripTitle({ words, size = "large" }: StripTitleProps) {
  return (
    <h1 className={`${styles.title} ${styles[size]}`}>
      {words.map((word, index) => (
        <span key={word} className={styles.strip} data-index={index % 3}>
          {word}
        </span>
      ))}
    </h1>
  );
}
