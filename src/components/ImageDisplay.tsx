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
    // Ensure src is a string before checking startsWith
    const srcString = typeof src === 'string' ? src : '';
    
    // Check if it's a localStorage key (starts with product_image_, casestudy_image_, blog_image_, or hero_image_)
    // Note: Cloudinary URLs will be treated as regular image paths and pass through
    if (
      srcString && (
      srcString.startsWith("product_image_") ||
      srcString.startsWith("casestudy_image_") ||
      srcString.startsWith("blog_image_") ||
      srcString.startsWith("hero_image_"))
    ) {
      if (typeof window !== "undefined") {
        const storedImage = localStorage.getItem(srcString);
        if (storedImage) {
          setImageSrc(storedImage);
        } else {
          // Fallback to placeholder if image not found
          setImageSrc("/images/placeholder.jpg");
        }
      }
    } else {
      // Regular image path or Cloudinary URL
      setImageSrc(srcString || "/images/placeholder.jpg");
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
