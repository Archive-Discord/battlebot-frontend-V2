import type { Item } from "@types";
import { useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { payMethods } from "@utils/Constants";

const Dropdown: React.FC<DropdownProps> = ({ selectCallback }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectItem, setSelectItem] = useState<Item>(payMethods[0]);
  const ref = useDetectClickOutside({
    onTriggered: () => setOpenDropdown(false),
  });

  useEffect(() => {
    selectCallback(selectItem.id);
  }, [selectItem]);

  return (
    <>
      <div
        ref={ref}
        className="relative lg:block inline-block w-full h-full min-h-[50px] h-[50px]"
      >
        <div
          className="h-full flex flex-row justify-between border px-3 py-1.5 rounded-xl"
          onClick={() => {
            if (!openDropdown) setOpenDropdown(true);
            else setOpenDropdown(false);
          }}
        >
          <div
            className={`flex flx-row items-center ${selectItem.icon && "h-8"}`}
          >
            <img src={selectItem.icon} className={`${selectItem.id === "kakaopay" ? "w-[55.156px] h-[23px]": "w-8 h-8"} mr-2 rounded-xl`}/>
            <span>{selectItem.name}</span>
          </div>
          <div className="flex items-center">
            <i
              className={`fas fa-caret-up mr-1 ${
                openDropdown ? "rotate-180" : ""
              }`}
              style={{
                transition: "all 0.3s",
              }}
            />
          </div>
        </div>
        <div
          className={`overflow-y-auto absolute min-h-[40px] max-h-[200px] bg-white border w-full mt-1 rounded-xl z-10 ${
            openDropdown ? "visible" : "invisible"
          }`}
          style={{
            transition: "all 0.3s",
            transform: openDropdown ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
          }}
        >
          {payMethods.map((item, index) => (
            <button
              onClick={() => {
                setOpenDropdown(false);
                setSelectItem(item);
              }}
              key={index}
              className={`w-full px-3 py-1.5 hover:bg-gray-100 ${
                index === 0 && "rounded-t-xl"
              } ${index == payMethods.length - 1 && "rounded-b-xl"}`}
            >
              <div className="w-full flex flex-row items-center justify-between">
                <div
                  className={`flex flex-row items-center h-8`}
                >
                  <img src={item.icon} className={`${item.id === "kakaopay" ? "w-[55.156px] h-[23px]": "w-8 h-8"} mr-2 rounded-xl`}/>
                  {item.name}
                </div>
                <div>
                  {selectItem.id == item.id && (
                    <i className="fas fa-check text-purple-500 mr-1" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

interface DropdownProps {
  selectCallback: (id: string) => void;
}
export default Dropdown;
