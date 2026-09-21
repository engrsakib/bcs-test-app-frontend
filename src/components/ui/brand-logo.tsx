type BrandLogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

/** Uses committed SVG in public/icons (logo.png is optional on server). */
export function BrandLogo({
  width = 120,
  height = 40,
  className = "",
}: BrandLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/icon.svg"
      width={width}
      height={height}
      alt="EduMaster Management"
      className={className}
      decoding="async"
    />
  );
}
