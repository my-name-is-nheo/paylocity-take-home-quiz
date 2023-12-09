import { FC } from "react";

export interface IconProps {
  icon: "delete" | "profile";
  className?: string;
}

const Icon: FC<IconProps> = ({ icon, className }) => (
  <img
    src={require(`../../assets/${icon}.png`)}
    className={className}
    loading="lazy"
  />
);

export { Icon };
