interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageDisplay = ({ src, alt, className, style }: ImageDisplayProps) => {
  const imgSrc = typeof src === "string" && src.length > 0 ? src : "/placeholder.svg";

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.src.endsWith("/placeholder.svg")) {
          target.src = "/placeholder.svg";
        }
      }}
    />
  );
};
