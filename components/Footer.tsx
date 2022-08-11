import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTranslation } from "react-i18next";
import { Theme } from "@types";

const Footer: React.FC<FooterProps> = ({ themeHanler, theme }) => {
  const language = [
    {
      name: "한국어",
      icon: "https://purecatamphetamine.github.io/country-flag-icons/3x2/KR.svg",
      id: "ko",
    },
    {
      name: "English",
      icon: "https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
      id: "en",
    },
  ];
  const { t, i18n } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectItem, setSelectItem] = useState(
    language.filter(language => language.id === i18n.language)[0]
  );
  const ref = useDetectClickOutside({
    onTriggered: () => setOpenDropdown(false),
  });
  return (
    <>
      <footer
        className="w-full bottom-0 bg-whtie border-t text-black"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="container p-10">
          <ul className="flex lg:flex-row flex-col lg:justify-start items-center lg:space-x-4 text-lg flex-wrap w-full">
            <li>
              <Link href={"/tos"}>
                <a>{t("footer.tos")}</a>
              </Link>
            </li>
            <li>
              <Link href={"/privacy"}>
                <a>{t("footer.privacy")}</a>
              </Link>
            </li>
            <li>
              <a
                href={"https://help.archiver.me/"}
                target={"_blank"}
                rel="noreferrer"
              >
                {t("footer.guide")}
              </a>
            </li>
            <li>
              <a
                href={"https://recruit.archiver.me/"}
                target={"_blank"}
                className="relative inline-flex items-center"
                rel="noreferrer"
              >
                {t("footer.recruit")}
                <span className="flex absolute h-2 w-2 right-0 lg:-mr-4 -mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                </span>
              </a>
            </li>
          </ul>
          <div className="flex lg:block mt-2 text-sm items-center justify-center">
            배틀이(Battlebot) | 부산광역시 동래구 명륜로 170 107동 1302호 | 대표
            김재국{" "}
          </div>
          <div className="flex lg:block text-sm items-center justify-center">
            사업자등록번호 : 870-10-01917 | 통신판매업 신고번호 :
            제2022-부산동래-0109 | E-mail: admin@battlebot.kr{" "}
          </div>
          <div className="mt-8 flex w-full lg:flex-row flex-col items-center lg:justify-start justify-center">
            <div className="space-x-2">
              <a href="https://archiver.me" target={"_blank"} rel="noreferrer">
                <Image
                  width={"60px"}
                  height={"60px"}
                  src={"/archive_logo.png"}
                />
              </a>
              <a href="https://discord.com" target={"_blank"} rel="noreferrer">
                <Image
                  width={"50px"}
                  height={"60px"}
                  src={"/discord_logo.png"}
                />
              </a>
            </div>
            <div className="flex items-center justify-center lg:ml-auto">
              <div
                ref={ref}
                className="relative lg:block inline-block w-48 h-full min-h-[50px] h-[50px]"
              >
                <div
                  className="h-full flex flex-row justify-between px-3 py-1.5 rounded-xl"
                  onClick={() => {
                    if (!openDropdown) setOpenDropdown(true);
                    else setOpenDropdown(false);
                  }}
                >
                  <div className="flex flx-row items-center">
                    <img
                      className="w-8 mr-2 rounded border"
                      src={selectItem.icon}
                    />
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
                  className={`overflow-y-auto absolute min-h-[40px] max-h-[200px] bg-white border w-full rounded-xl z-10 ${
                    openDropdown ? "visible" : "invisible"
                  }`}
                  style={{
                    transition: "all 0.3s",
                    transform: openDropdown ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "bottom",
                    bottom: "50px",
                  }}
                >
                  {language.map((item, index) => (
                    <button
                      onClick={() => {
                        setOpenDropdown(false);
                        setSelectItem(
                          language.filter(
                            language => language.id === item.id
                          )[0]
                        );
                        i18n.changeLanguage(item.id);
                      }}
                      key={index}
                      className={`w-full px-3 py-1.5 hover:bg-gray-100 min-h-[40px] ${
                        index === 0 && "rounded-t-xl"
                      } ${index == language.length - 1 && "rounded-b-xl"}`}
                    >
                      <div className="w-full flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                          <img
                            className="w-8 mr-2 rounded border"
                            src={item.icon}
                          />
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
              <button
                className="w-8 h-8 bg-blue-100 rounded-lg dark:bg-slate-800 flex items-center justify-center hover:ring-2 ring-blue-400 transition-all duration-300 focus:outline-none"
                onClick={() =>
                  themeHanler(theme === "light" ? "dark" : "light")
                }
                aria-label="Toggle Dark Mode"
              >
                {theme === "light" ? (
                  <i className="flex items-center justify-center far fa-moon w-5 h-5" />
                ) : (
                  <i className="flex items-center justify-center fas fa-sun w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

interface FooterProps {
  themeHanler: (theme: Theme) => void;
  theme: Theme;
}

export default Footer;
