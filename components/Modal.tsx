import { useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import Button from "./Button";
import Tooltip from "./Tooltip";

const Modal: React.FC<Modal> = ({
  title,
  children,
  button,
  isOpen,
  description,
  notClose,
  callbackOpen,
}) => {
  const ref = useDetectClickOutside({
    onTriggered: () => callbackOpen(false),
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <>
      {open ? (
        <>
          <div
            className="animate-fade fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            style={{
              zIndex: "10000",
            }}
          />
          <div
            style={{
              zIndex: "10001",
              fontFamily: "Noto Sans KR",
            }}
            ref={ref}
            className="animate-fade fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[43rem] bg-white max-w-[90vw] max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-xl"
          >
            <div className="p-5 text-2xl font-bold w-full flex items-center">
              <span>{title}</span>
              {description && (
                <>
                  <Tooltip name={description} place="bottom" description={description}>
                    <i className="fas fa-question-circle lg:ml-2 ml-1 text-purple-500" />
                  </Tooltip>
                </>
              )}
              {!notClose && (
                <i
                  onClick={() => callbackOpen(false)}
                  className="ml-auto fas fa-times cursor-pointer hover:text-red-500 transition duration-300 ease-in-out"
                />
              )}
            </div>
            <hr className="w-full" />
            <div className="p-5">{children}</div>
            <hr className="w-full" />
            <div className="p-5 flex items-center justify-end">
              <div>
                {!notClose && (
                  <Button
                    className="mx-2"
                    onClick={() => callbackOpen(false)}
                    label="닫기"
                  />
                )}
                {button}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

interface Modal {
  title: string;
  children: React.ReactNode;
  description?: string;
  button: React.ReactNode;
  isOpen: boolean;
  callbackOpen: (open: boolean) => void;
  notClose?: boolean;
}

export default Modal;
