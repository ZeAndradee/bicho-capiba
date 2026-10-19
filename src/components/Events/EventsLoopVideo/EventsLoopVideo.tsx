import styles from "./EventsLoopVideo.module.css";

export default function EventsLoopVideo() {
  return (
    <div className={styles.wrapper} aria-hidden>
      <video
        className={styles.video}
        src="/videos/EventsLoop.mp4"
        width={1080}
        height={1080}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
