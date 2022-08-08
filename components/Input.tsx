import { validateEmail, validatePhone } from "@utils/utils";
import React, {
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";

const Input: React.FC<InputProps> = ({
  defaultValue,
  onChangeHandler,
  className,
  placeholder,
  type,
}) => {
  const [value, setValue] = useState<string | undefined>(
    defaultValue ? defaultValue : undefined
  );
  const [error, setError] = useState<string>();
  useEffect(() => {
    onChangeHandler(value);
  }, [value]);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (!value) return;
    if (type === "email") {
      if (!validateEmail(value)) setError("이메일을 정확히 입력해 주세요");
      else setError("");
    } else if (type == "phone") {
      if (!validatePhone(value)) setError("전화번호를 정확히 입력해 주세요");
      else setError("");
    }
  }, [value]);
  const getValue = () => {
    if(type == "phone") return value?.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "")
    return value
  }
  return (
    <>
      <div className={`${className} flex flex-col`}>
        <input
          type={type}
          value={getValue()}
          placeholder={placeholder}
          onChange={e => {
            setValue(e.target.value);
          }}
          className={`border py-2 px-3 rounded-lg focus:outline-none focus:ring-1 ${
            error
              ? "focus:border-red-500 focus:ring-red-500"
              : "focus:border-violet-500 focus:ring-violet-500"
          }`}
        />
        {error ? (
          <span className="text-sm ml-2 text-red-500">{error}</span>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

interface InputProps {
  placeholder: string;
  onChangeHandler: (value?: string) => void;
  defaultValue?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
}
export default Input;
