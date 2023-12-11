import { FC, ButtonHTMLAttributes } from "react";
import { ButtonColor } from "./types";

const Button: FC<{
  onClick?: () => void;
  label: string;
  color?: ButtonColor;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
}> = ({ onClick, label, color = ButtonColor.White, type, className = "" }) => {
  const colorClassName: Record<ButtonColor, string> = {
    [ButtonColor.Blue]: `text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${className}`,
    [ButtonColor.Green]: `justify-center rounded-md bg-green-400 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-black-300 hover:bg-green-700 sm:mt-0 sm:w-auto ${className}`,
    [ButtonColor.Red]: ` justify-center rounded-md bg-red-300 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-black-300 hover:bg-red-600 sm:mt-0 sm:w-auto ${className}`,
    [ButtonColor.White]: `justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-black-300 hover:bg-red-50 sm:mt-0 sm:w-auto ${className}`,
  };

  return (
    <button className={colorClassName[color]} onClick={onClick} type={type}>
      {label}
    </button>
  );
};

export { Button };
