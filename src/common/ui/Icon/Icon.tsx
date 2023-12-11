import { FC } from "react";

export interface IconProps {
  icon: "delete" | "profile";
  alt: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ icon, className, alt }) => (
  <img
    src={require(`../../assets/${icon}.png`)}
    className={className}
    loading="lazy"
    alt={alt}
  />
);

Icon.defaultProps = {
  className: undefined,
};

export { Icon };
