import { validateEmail, validatePhone } from "@utils/utils";
import React, {
  CSSProperties,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

const Input: React.FC<InputProps> = ({
  defaultValue,
  onChangeHandler,
  className,
  placeholder,
  type,
  style,
  disable
}) => {
  const [value, setValue] = useState<string | undefined>(
    defaultValue ? defaultValue : undefined
  );
  const [error, setError] = useState<string>();
  const { t } = useTranslation()
  useEffect(() => {
    onChangeHandler(value);
  }, [value]);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (!value) return;
    if (type === "email") {
      if (!validateEmail(value)) setError(t("input.error.email"));
      else setError("");
    } else if (type == "phone") {
      if (!validatePhone(value)) setError(t("input.error.phone"));
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
          disabled={disable}
          value={getValue()}
          placeholder={placeholder}
          onChange={e => {
            setValue(e.target.value);
          }}
          className={`border py-2 px-2 rounded-lg focus:outline-none focus:ring-1 disabled:opacity-75 ${
            error
              ? "focus:border-red-500 focus:ring-red-500"
              : "focus:border-violet-500 focus:ring-violet-500"
          }`}
          style={style}
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
  disable?: boolean
  className?: string;
  type?: HTMLInputTypeAttribute;
  style?: CSSProperties
}
export default Input;
