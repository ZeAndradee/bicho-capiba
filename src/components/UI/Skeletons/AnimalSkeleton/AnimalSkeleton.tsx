"use client";

import styles from "./AnimalSkeleton.module.css";

export default function AnimalSkeleton() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.carousel}>
          <div className={styles.leftSideImages}>
            <div className={styles.sideImageSkeleton}></div>
          </div>
          <div className={styles.mainImageSkeleton}></div>
          <div className={styles.rightSideImages}>
            <div className={styles.sideImageSkeleton}></div>
          </div>
        </div>
        <div className={styles.dotsContainer}>
          <div className={styles.dotSkeleton}></div>
          <div className={styles.dotSkeleton}></div>
          <div className={styles.dotSkeleton}></div>
        </div>
      </section>

      <section className={styles.animalInfo}>
        <div className={styles.container}>
          <div className={styles.leftColumn}>
            <div className={styles.titleSkeleton}></div>

            <div className={styles.stats}>
              <div className={styles.statSkeleton}></div>
              <div className={styles.statSkeleton}></div>
              <div className={styles.statSkeleton}></div>
            </div>

            <div
              className={`${styles.adoptButtonSkeleton} ${styles.adoptButtonMobile}`}
            ></div>

            <div className={styles.historyTitleSkeleton}></div>
            <div className={styles.historySection}>
              <div className={styles.textLineSkeleton}></div>
              <div className={styles.textLineSkeleton}></div>
              <div className={styles.textLineSkeleton}></div>
              <div className={styles.textLineSkeleton}></div>
              <div className={styles.textLineSkeleton}></div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div
              className={`${styles.adoptButtonSkeleton} ${styles.adoptButtonDesktop}`}
            ></div>
            <div className={styles.mapSkeleton}></div>
            <div className={styles.ongInfoSkeleton}>
              <div className={styles.ongImageSkeleton}></div>
              <div className={styles.ongDetailsSkeleton}>
                <div className={styles.ongNameSkeleton}></div>
                <div className={styles.ongAddressSkeleton}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
