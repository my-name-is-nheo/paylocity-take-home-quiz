import { FC } from "react";

export interface HeaderProps {
  label: string;
  headerClassName?: string;
  onLabelClick?: () => void;
}

const Header: FC<HeaderProps> = ({ label, headerClassName, onLabelClick }) => (
  <h3 className={headerClassName} onClick={onLabelClick}>
    {label}
  </h3>
);

export { Header };
