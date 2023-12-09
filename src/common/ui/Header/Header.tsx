import { FC } from "react";

export interface HeaderProps {
  label: string;
  headerClassName?: string;
}

const Header: FC<HeaderProps> = ({ label, headerClassName }) => (
  <h3 className={headerClassName}>{label}</h3>
);

export { Header };
