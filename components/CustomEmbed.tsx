import { BattleBotEmbed } from "@types";
import { useEffect, useState } from "react";
import Input from "./Input";

const CustomEmbed: React.FC<CustomEmbedProps> = ({ callbackEmbed }) => {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [color, setColor] = useState<string>("#7C3AED");
  useEffect(() => {
    callbackEmbed({
        color,
        description,
        title
    })
  }, [title, description, color])
  
  return (
    <>
      <div className="border p-3 rounded-xl flex lg:flex-row flex-col">
        <div className="lg:w-3/5 w-full mr-3">
          <div className="flex flex-row items-center justify-between">
            <span className="font-bold">제목</span>
            <Input onChangeHandler={setTitle} placeholder={"제목"} />
          </div>
          <div className="flex flex-row items-center justify-between mt-2">
            <span className="font-bold">설명</span>
            <Input onChangeHandler={setDescription} placeholder={"설명"} />
          </div>
          <div className="flex flex-row items-center justify-between mt-3">
            <span className="font-bold">색상</span>
            <input
              className="min-h-[30px] border rounded-lg focus:outline-none focus:ring-1 focus:border-violet-500 focus:ring-violet-500 mb-1"
              type={"color"}
              value={color}
              onChange={e => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:w-2/5 w-full lg:mt-0 mt-4 flex items-center justify-center">
          <div
            className={`rounded-md w-full border-purple-500 h-[100px] p-[16px] bg-[#36393F] text-white flex flex-col`}
            style={{ borderColor: color, borderLeft: "4px solid", borderRadius: "4px" }}
          >
            <span className="text-lg font-semibold">{title}</span>
            <span className="text-sm mt-[13px]">{description}</span>
          </div>
        </div>
      </div>
    </>
  );
};

interface CustomEmbedProps {
  callbackEmbed: (embed: BattleBotEmbed) => void;
}
export default CustomEmbed;
