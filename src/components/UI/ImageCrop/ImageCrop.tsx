"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "../Button/Button";
import { FaTimes } from "react-icons/fa";
import { IoCrop } from "react-icons/io5";
import styles from "./ImageCrop.module.css";

interface ImageCropProps {
  src: string;
  onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: "card" | "animalProfile" | "custom";
  customAspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCrop({
  src,
  onCropComplete,
  onCancel,
  aspectRatio = "animalProfile",
  customAspectRatio,
}: ImageCropProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const getAspectRatio = () => {
    if (aspectRatio === "custom" && customAspectRatio) {
      return customAspectRatio;
    }
    if (aspectRatio === "card") {
      return 320 / 200;
    }
    return 4 / 2.5;
  };

  const aspect = getAspectRatio();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onCropComplete(blob, url);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recortar Imagem</h2>
          <button
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.cropContainer}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className={styles.reactCrop}
          >
            <img
              ref={imgRef}
              alt="Imagem para recortar"
              src={src}
              onLoad={onImageLoad}
              className={styles.image}
              style={{ objectFit: "contain", maxHeight: "60vh" }}
            />
          </ReactCrop>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            color="orange"
            onClick={onCancel}
            size="medium"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            color="yellow"
            onClick={handleCropComplete}
            icon={<IoCrop />}
            iconPosition="left"
            size="medium"
          >
            Cortar
          </Button>
        </div>
      </div>
    </div>
  );
}
