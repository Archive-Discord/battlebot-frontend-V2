import type { Guild } from "@types";
import { SideBarItems } from "@utils/Constants";
import { useRouter } from "next/router";
import React, { useState } from "react";
import SidebarSelectServer from "@components/SidebarSelectServer";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const SideBar: React.FC<SideBarProps> = ({ guild }) => {
  const router = useRouter();
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false);
  const [serverManageOpen, setServerManageOpen] = useState(true);
  const [serverUtilOpen, setServerUtilOpen] = useState(true);
  return (
    <>
      <aside
        className={`fixed left-0 p-5 border-r h-full overflow-y-auto w-full lg:w-[300px] lg:min-w-[300px] lg:visible lg:transform-none bg-white ${
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
              <Link
                key={item.pathName}
                href={`/dashboard/${guild.id}${item.path}`}
              >
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
                    <span className="text-sm">{t(item.name)}</span>
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
          <div>
            <button
              className="w-full items-center flex my-2 justify-between px-3"
              onClick={() => {
                if (serverManageOpen) setServerManageOpen(false);
                else setServerManageOpen(true);
              }}
            >
              <span className="text-sm font-bold ">{t("dashboard.sidebar.categori.manage")}</span>
              <i
                className={`fas fa-caret-up ${
                  serverManageOpen ? "rotate-180" : ""
                }`}
                style={{
                  transition: "all 0.3s",
                }}
              />
            </button>
            <div
              className="space-y-1"
              style={{
                transition: "all 0.3s",
                transform: serverManageOpen ? "scaleY(1)" : "scaleY(0)",
                height: serverManageOpen ? "100%" : "0px",
                transformOrigin: "top",
              }}
            >
              {SideBarItems.filter(item => {
                return item.categori === "server_manage";
              }).map((item, index) => (
                <>
                  <Link
                    key={item.pathName}
                    href={`/dashboard/${guild.id}${item.path}`}
                  >
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
                        <span className="text-sm">{t(item.name)}</span>
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
            </div>
          </div>
          <div>
            <button
              className="w-full items-center flex my-2 justify-between px-3"
              onClick={() => {
                if (serverUtilOpen) setServerUtilOpen(false);
                else setServerUtilOpen(true);
              }}
            >
              <span className="text-sm font-bold ">{t("dashboard.sidebar.categori.util")}</span>
              <i
                className={`fas fa-caret-up ${
                  serverUtilOpen ? "rotate-180" : ""
                }`}
                style={{
                  transition: "all 0.3s",
                }}
              />
            </button>
            <div
              className="space-y-1"
              style={{
                transition: "all 0.3s",
                transform: serverUtilOpen ? "scaleY(1)" : "scaleY(0)",
                height: serverUtilOpen ? "100%" : "0px",
                transformOrigin: "top",
              }}
            >
              {SideBarItems.filter(item => {
                return item.categori === "utils";
              }).map((item, index) => (
                <>
                  <Link
                    key={item.pathName}
                    href={`/dashboard/${guild.id}${item.path}`}
                  >
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
                        <span className="text-sm">{t(item.name)}</span>
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
            </div>
          </div>
        </ul>
      </aside>
      <div className="lg:hidden fixed bottom-0 left-0 z-20 ml-4 mb-5">
        <button
          className="bg-white w-full flex items-center justify-center shadow-[0_13px_135px_2px_rgba(0,0,0,0.6)] p-2 w-[38px] h-[38px] transition duration-200"
          style={{
            borderRadius: "40%",
          }}
          onClick={() => {
            if (isOpen) setIsOpen(false);
            else setIsOpen(true);
          }}
        >
          <i
            className={`fas fa-arrow-right text-xl ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{
              transition: "all 0.3s",
            }}
          />
        </button>
      </div>
    </>
  );
};

interface SideBarProps {
  guild: Guild;
}

export default SideBar;
