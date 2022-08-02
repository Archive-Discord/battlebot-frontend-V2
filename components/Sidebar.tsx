import { Guild } from "@types";
import React, { useState } from "react";
import SidebarSelectServer from "@components/SidebarSelectServer";
import { SideBarItems } from "@utils/Constants";
import { useRouter } from "next/router";
import Link from "next/link";

const SideBar: React.FC<SideBarProps> = ({ guild }) => {
  const router = useRouter();
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
        <ul className="mt-3 space-y-1">
          {SideBarItems.filter(item => {
            return item.categori === "none";
          }).map((item, index) => (
            <>
              <Link href={`/dashboard/${guild.id}${item.path}`}>
                <a
                  key={index}
                  className={`${
                    item.pathName === router.pathname ? "bg-gray-100" : ""
                  } w-full px-5 py-1.5 flex flex-row items-center rounded-xl min-h-[45px] h-[45px] justify-between`}
                >
                  <div
                    className={`flex items-center ${
                      item.pathName === router.pathname
                        ? "opacity-100"
                        : "hover:opacity-100 opacity-60"
                    }`}
                    style={{
                      transition: "all 0.3s",
                    }}
                  >
                    <i
                      className={
                        item.icon +
                        " text-lg w-5 h-5 m-auto flex items-center justify-center mr-3"
                      }
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="">
                    {item.premium ? (
                      <>
                        <i className="fas fa-crown text-yellow-500" />
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </a>
              </Link>
            </>
          ))}
        </ul>
      </aside>
      <div className="lg:hidden absolute bottom-0 left-0 z-20 ml-4 mb-7">
        <button
          className="w-full p-3 w-14 h-14 hover:shadow-[0_13px_100px_2px_rgba(0,0,0,0.3)] shadow-[0_13px_120px_2px_rgba(0,0,0,0.3)] transition duration-200"
          style={{
            borderRadius: "40%",
          }}
          onClick={() => {
            if (isOpen) setIsOpen(false);
            else setIsOpen(true);
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
