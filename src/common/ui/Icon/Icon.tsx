import { FC } from "react";

export interface IconProps {
  icon: "delete" | "profile";
}

const Icon: FC<IconProps> = ({ icon }) => {
  return <img src={require(`../assets/${icon}.png`)} />;
};

export { Icon };
