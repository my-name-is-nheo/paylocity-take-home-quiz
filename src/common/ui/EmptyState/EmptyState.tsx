import { FC } from "react";

const EmptyState: FC<{
  text: string;
  className?: string;
}> = ({ text, className }) => <h3 className={className}>{text}</h3>;

export { EmptyState };
