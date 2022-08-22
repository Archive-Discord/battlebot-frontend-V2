import { MouseEvent, useEffect, useState } from "react";
import Button from "./Button";

const ChangeSaveAlert: React.FC<ChangeSaveAlertProps> = ({onClickSave, show}) => {
  const [isShow, setIsShow] = useState<boolean>(show);
  useEffect(() => {
    // @ts-ignore
    if (window.ChannelIO) {
      // @ts-ignore
      window.ChannelIO("shutdown");
    }
  },[]);
  return (
    <>
      <div
        className="fixed lg:px-[100px] lg:pb-[30px] bottom-0 lg:max-w-[90vw] w-full lg:w-[100rem] lg:z-[6] right-0"
        style={{
          fontFamily: "Noto Sans KR",
          opacity: !isShow ? "0" : "1",
          transition: "all .2s",
          visibility: !isShow ? "hidden" : "visible",
        }}
      >
        <div className="border bg-white rounded-lg h-16 p-2 px-6 flex items-center justify-between">
          <span className="font-bold text-lg">변경사항이 있는 거 같아요!</span>
          <div>
            <Button type="success" onClick={onClickSave} label={"저장하기"} />
          </div>
        </div>
      </div>
    </>
  );
};

interface ChangeSaveAlertProps {
    show: boolean;
    onClickSave: () => void
}
export default ChangeSaveAlert;
