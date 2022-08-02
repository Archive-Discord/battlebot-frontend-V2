import { Guild } from "@types";
import { guildProfileLink } from "@utils/utils";
import React, { useState } from "react";
import SidebarSelectServer from "@components/SidebarSelectServer";

const SideBar: React.FC<SideBarProps> = ({ guild }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <aside
        className={`fixed left-0 p-5 border-r h-full overflow-y-auto w-full lg:w-[300px] lg:min-w-[300px] lg:visible lg:transform-none ${
          isOpen ? "scale-x-100" : "scale-x-0"
        }`}
        style={{
          marginTop: "58px",
          fontFamily: "Noto Sans KR",
          transition: "transform 0.3s",
          transformOrigin: "left",
        }}
      >
        <SidebarSelectServer selectGuild={guild} />
        <ul>
          <li></li>
        </ul>
      </aside>
      <div className="lg:hidden absolute bottom-0 left-0 z-20 ml-4 mb-7">
        <button
          className="w-full p-3 w-14 h-14 hover:shadow-[0_13px_100px_2px_rgba(0,0,0,0.3)] shadow-[0_13px_120px_2px_rgba(0,0,0,0.3)] transition duration-200"
          style={{
            borderRadius: "40%",
          }}
          onClick={() => {
            if(isOpen) setIsOpen(false)
            else setIsOpen(true)
          }}
        >
          {isOpen ? (
            <>
              <i className="fas fa-arrow-left text-2xl" />
            </>
          ) : (
            <>
              <i className="fas fa-arrow-right text-2xl" />
            </>
          )}
        </button>
      </div>
    </>
  );
};

interface SideBarProps {
  guild: Guild;
}

export default SideBar;
