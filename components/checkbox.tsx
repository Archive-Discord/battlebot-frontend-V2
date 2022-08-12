import React, { CSSProperties, useEffect, useState } from "react";

const CheckBox: React.FC<CheckBoxProps> = ({
  onChangeHandler,
  className,
  placeholder,
  isSelect,
  disable,
}) => {
  const [select, setSelect] = useState<boolean>(isSelect ? isSelect : false);
  useEffect(() => {
    onChangeHandler(select);
  }, [select]);
  useEffect(() => {
    setSelect(isSelect ? isSelect : false);
  }, [isSelect]);
  return (
    <>
      <div
        className={`${className ? className : ""} flex items-center form-check`}
      >
        <input
          className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-[#7C3AED] checked:border-[#7C3AED] focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer dark:text-white"
          type="checkbox"
          checked={select}
          onChange={e => setSelect(e.target.checked)}
          disabled={disable}
          id={`flexCheckChecked-${placeholder}`}
        />
        <label
          className="form-check-label inline-block text-gray-800 dark:text-white"
          htmlFor={`flexCheckChecked-${placeholder}`}
        >
          {placeholder}
        </label>
      </div>
    </>
  );
};

interface CheckBoxProps {
  placeholder: string;
  className?: string;
  isSelect?: boolean;
  disable?: boolean;
  style?: CSSProperties
  onChangeHandler: (check: boolean) => void;
}
export default CheckBox;
