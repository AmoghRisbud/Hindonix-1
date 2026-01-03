import { useState, useEffect } from "react";

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageDisplay = ({
  src,
  alt,
  className,
  style,
}: ImageDisplayProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    // Check if it's a localStorage key (starts with product_image_, casestudy_image_, blog_image_, or hero_image_)
    if (
      src.startsWith("product_image_") ||
      src.startsWith("casestudy_image_") ||
      src.startsWith("blog_image_") ||
      src.startsWith("hero_image_")
    ) {
      if (typeof window !== "undefined") {
        const storedImage = localStorage.getItem(src);
        if (storedImage) {
          setImageSrc(storedImage);
        } else {
          // Fallback to placeholder if image not found
          setImageSrc("/images/placeholder.jpg");
        }
      }
    } else {
      // Regular image path
      setImageSrc(src);
    }
  }, [src]);

  if (!imageSrc) {
    return (
      <div className={className} style={style}>
        Loading...
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} style={style} />;
};
