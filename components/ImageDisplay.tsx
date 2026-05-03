"use client";

import { useState, useEffect } from "react";

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageDisplay = ({ src, alt, className, style }: ImageDisplayProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    const srcString = typeof src === "string" ? src : "";
    if (
      srcString &&
      (srcString.startsWith("product_image_") ||
        srcString.startsWith("casestudy_image_") ||
        srcString.startsWith("blog_image_") ||
        srcString.startsWith("hero_image_"))
    ) {
      const storedImage = localStorage.getItem(srcString);
      setImageSrc(storedImage ?? "/images/placeholder.jpg");
    } else {
      setImageSrc(srcString || "/images/placeholder.jpg");
    }
  }, [src]);

  if (!imageSrc) {
    return <div className={className} style={style}>Loading...</div>;
  }

  return <img src={imageSrc} alt={alt} className={className} style={style} />;
};
