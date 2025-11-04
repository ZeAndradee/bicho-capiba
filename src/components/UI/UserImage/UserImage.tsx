"use client";

import Image from "next/image";
import { useState } from "react";
import { FiCamera } from "react-icons/fi";
import styles from "./UserImage.module.css";

interface UserImageProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  border?: boolean;
  borderColor?: "default" | "orange" | "green" | "yellow";
  fallbackText?: string;
  className?: string;
  onClick?: () => void;
  editable?: boolean;
  disabled?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 120,
};

export default function UserImage({
  src,
  alt = "User",
  size = "md",
  borderRadius = "full",
  border = true,
  borderColor = "default",
  fallbackText,
  className = "",
  onClick,
  editable = false,
  disabled = false,
}: UserImageProps) {
  const [imageError, setImageError] = useState(false);
  const imageSize = sizeMap[size];

  const handleImageError = () => {
    setImageError(true);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getFallbackInitials = () => {
    if (fallbackText) {
      return fallbackText
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
    }
    return "U";
  };

  const containerClasses = [
    styles.userImage,
    styles[`size-${size}`],
    styles[`radius-${borderRadius}`],
    border && styles.border,
    border && styles[`border-${borderColor}`],
    onClick && styles.clickable,
    editable && styles.editable,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!src || imageError || !isValidUrl(src)) {
    return (
      <div className={containerClasses} onClick={onClick}>
        <span className={styles.fallbackText}>{getFallbackInitials()}</span>
        {editable && (
          <div className={styles.cameraOverlay}>
            <FiCamera className={styles.cameraIcon} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        width={imageSize}
        height={imageSize}
        className={styles.image}
        onError={handleImageError}
        priority={false}
      />
      {editable && (
        <div className={styles.cameraOverlay}>
          <FiCamera className={styles.cameraIcon} />
        </div>
      )}
    </div>
  );
}
