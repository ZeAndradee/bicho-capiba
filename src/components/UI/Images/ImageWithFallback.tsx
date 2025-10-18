"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { IoPawSharp } from "react-icons/io5";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  className?: string;
}

export default function ImageWithFallback({
  alt,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "200px",
          minWidth: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--text-color)",
            opacity: 0.1,
          }}
        />
        <IoPawSharp
          style={{
            color: "#838383",
            fontSize: "3rem",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>
    );
  }

  return (
    <Image {...props} alt={alt} className={className} onError={handleError} />
  );
}
