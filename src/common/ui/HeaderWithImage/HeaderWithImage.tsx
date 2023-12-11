import { FC } from "react";
import { Header, HeaderProps } from "../Header/Header";

interface HeaderWithImageProps extends HeaderProps {
  source: string;
  imageClassName: string;
  alt: string;
}

const HeaderWithImage: FC<HeaderWithImageProps> = ({
  label,
  headerClassName,
  source,
  alt,
  imageClassName,
}) => {
  return (
    <div className="flex justify-center items-center">
      <img className={imageClassName} src={source} alt={alt} loading="lazy" />
      <Header label={label} headerClassName={headerClassName} />
    </div>
  );
};

export { HeaderWithImage };
