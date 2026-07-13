import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export const BRAND_NAME = "Investal Estate";
export const BRAND_NAME_UPPER = "INVESTAL ESTATE";

export default function BrandLogo({
  className = "h-14 w-24 md:h-16 md:w-28",
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/investal-logo.jpg"
      alt={BRAND_NAME}
      width={280}
      height={280}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
