import React from "react";

const Button: React.FC<ButtonProps> = ({ onClick, label, className, type, icon }) => {
  if (type === "danger") {
    return (
      <>
        <button
          className={`px-3 py-1 rounded-md bg-red-500 hover:bg-red-700 text-white transition transform transition-all duration-300 ease-in-out ${className}`}
          onClick={onClick}
        >
          <i className={icon}/>{label}
        </button>
      </>
    );
  } else if (type === "warning") {
    return (
      <>
        <button
          className={`px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white transition transform transition-all duration-300 ease-in-out ${className}`}
          onClick={onClick}
        >
          <i className={icon}/>{label}
        </button>
      </>
    );
  } else if (type === "success") {
    return (
      <>
        <button
          className={`px-3 py-1 rounded-md bg-purple-500 hover:bg-purple-600 text-white transition transform transition-all duration-300 ease-in-out ${className}`}
          onClick={onClick}
        >
          <i className={icon}/>{label}
        </button>
      </>
    );
  }
  return (
    <>
      <button
        className={`px-3 py-1 rounded-md border hover:bg-gray-200 transition transform transition-all duration-300 ease-in-out ${className}`}
        onClick={onClick}
      >
        <i className={icon}/>{label}
      </button>
    </>
  );
};

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "warning" | "danger" | "success" | "general";
  label: string;
  icon?:string
  className?: string;
}
export default Button;
