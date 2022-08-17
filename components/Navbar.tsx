import type { User as BattleBotUser } from "@types";
import type { User } from "discord.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBarItems } from "@utils/Constants";
import { classNames, userAvaterLink } from "@utils/utils";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTranslation } from "react-i18next";
import { swrfetcher } from "@utils/client";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import FlareLane from "@flarelane/flarelane-web-sdk";

interface NavbarProps {
  auth: string;
}

const Navbar = ({ auth }: NavbarProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [userDropDownOpen, setUserDropDownOpen] = useState(false);
  const [openMobileDropDown, setOpenMobileDropDown] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();
  const ref = useDetectClickOutside({
    onTriggered: () => setUserDropDownOpen(false),
  });
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });

  const { data: userData, error: userError } = useSWR<BattleBotUser>(
    `/auth/me`,
    swrfetcher
  );

  useEffect(() => {
    if (localStorage.userData) {
      setUser(auth ? JSON.parse(localStorage.userData) : null);
    } else {
      if (!userError && userData) {
        setUser(userData.user);
        localStorage.userData = JSON.stringify(userData.user);
        FlareLane.setUserId(userData.user.id);
        FlareLane.setTags({
          username: userData.user.username,
          discriminator: userData.user.discriminator,
        });
      } else {
        localStorage.removeItem("userData");
      }
    }
  }, [userData, auth]);

  const Login = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_URL +
      `/auth/discord?redirect=${router.asPath}`;
  };

  const Logout = () => {
    localStorage.removeItem("userData");
    window.location.href = process.env.NEXT_PUBLIC_API_URL + `/auth/logout`;
  };

  return (
    <>
      <nav
        className={
          router.asPath === "/"
            ? classNames(
                !openMobileDropDown && scrollPosition < 1
                  ? "text-white"
                  : "bg-white text-black border-b",
                "fixed top-0 w-full font-bold z-40"
              )
            : "fixed top-0 w-full font-bold bg-white border-b z-40"
        }
      >
        <div className="flex flex-row items-center w-full px-10 py-1 lg:py-1 nav-container">
          <div className="flex align-center items-center mr-8">
            <Link href={"/"}>
              <a className="flex items-center">
                <div className="flex items-center">
                  <Image
                    src={"/logo.png"}
                    alt="배틀이"
                    width="50px"
                    height="50px"
                  />
                </div>
              </a>
            </Link>
            <span
              style={{ fontFamily: "Noto Sans KR" }}
              className="text-xl lg:text-xl font-bold ml-2"
            >
              {t("battlebot")}
            </span>
          </div>
          <div
            className="flex lg:block hidden space-x-2"
            style={{ fontFamily: "Noto Sans KR" }}
            key="desktop"
          >
            {NavBarItems.map((item) => (
              <>
                <Link href={item.href} key={item.name}>
                  <a
                    className={
                      router.asPath === "/"
                        ? classNames(
                            !openMobileDropDown && scrollPosition < 1
                              ? "hover:bg-violet-800 py-3 text-sm px-2 rounded-lg"
                              : "hover:bg-gray-100 text-sm py-3 px-2 rounded-lg"
                          )
                        : "hover:bg-gray-100 text-sm py-3 px-2 rounded-lg"
                    }
                  >
                    {t(item.name)}
                  </a>
                </Link>
              </>
            ))}
          </div>
          <div
            ref={ref}
            className="lg:block hidden ml-auto"
            onFocus={() => setUserDropDownOpen(true)}
            onClick={() => {
              if (userDropDownOpen) setUserDropDownOpen(false);
              else setUserDropDownOpen(true);
            }}
            onBlur={() => setUserDropDownOpen(false)}
          >
            {user ? (
              <>
                <div className="flex flex-row items-center text-sm">
                  <img
                    className="w-8 h-8 rounded-full mr-2"
                    src={userAvaterLink(user)}
                  />
                  <span>{user.username}</span>
                  <i className="fas fa-caret-down ml-2" />
                </div>
                <div
                  className={`rounded drop-shadow-lg absolute mt-14 top-0 w-36 bg-white text-black text-sm ${
                    userDropDownOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="relative flex flex-col">
                    <Link href={`/me`}>
                      <a className="px-4 py-2 block hover:bg-gray-100 rounded-t">
                        <i className="fas fa-user mr-2" />
                        <span>{t("navbar.myInfo")}</span>
                      </a>
                    </Link>
                    <div>
                      <a
                        onClick={Logout}
                        className="px-4 py-2 block text-red-500 hover:bg-gray-100 rounded-b"
                      >
                        <i className="fas fa-sign-out-alt mr-2" />
                        <span>{t("navbar.logout")}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button onClick={Login}>{t("navbar.login")}</button>
              </>
            )}
          </div>
          {openMobileDropDown ? (
            <>
              <button
                className="lg:hidden block w-8 h-8 ml-auto"
                onClick={() => {
                  if (!openMobileDropDown) setOpenMobileDropDown(true);
                  else setOpenMobileDropDown(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="line-icon"
                >
                  <path
                    fill={
                      router.asPath === "/"
                        ? classNames(
                            !openMobileDropDown && scrollPosition < 1
                              ? "#fff"
                              : "#000"
                          )
                        : "#000"
                    }
                    style={{ transition: "all 0.3s" }}
                    fillRule="evenodd"
                    d="M13.815 12l5.651-5.651a1.2 1.2 0 00-1.697-1.698l-5.651 5.652-5.652-5.652a1.201 1.201 0 00-1.697 1.698L10.421 12l-5.652 5.651a1.202 1.202 0 00.849 2.049c.307 0 .614-.117.848-.351l5.652-5.652 5.651 5.652a1.198 1.198 0 001.697 0 1.2 1.2 0 000-1.698L13.815 12z"
                  ></path>
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                className="lg:hidden block w-8 h-8 ml-auto"
                onClick={() => {
                  if (!openMobileDropDown) setOpenMobileDropDown(true);
                  else setOpenMobileDropDown(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="line-icon"
                >
                  <path
                    fill={
                      router.asPath === "/"
                        ? classNames(
                            !openMobileDropDown && scrollPosition < 1
                              ? "#fff"
                              : "#000"
                          )
                        : "#000"
                    }
                    style={{ transition: "all 0.3s" }}
                    d="M4.118 6.2h16a1.2 1.2 0 100-2.4h-16a1.2 1.2 0 100 2.4m16 4.6h-16a1.2 1.2 0 100 2.4h16a1.2 1.2 0 100-2.4m0 7h-16a1.2 1.2 0 100 2.4h16a1.2 1.2 0 100-2.4"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </nav>
      <div
        className={`z-30 w-full h-full fixed bg-white mt-2 sm:mt-0 lg:hidden overflow-y-scroll lg:scroll-none pt-16 ${
          openMobileDropDown ? "visible" : "invisible"
        }`}
        style={{
          fontFamily: "Noto Sans KR",
          transition: "all 0.3s",
          transform: openMobileDropDown ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
        }}
        key="mobile"
      >
        <div className="flex flex-col p-4">
          {NavBarItems.map((item) => (
            <>
              <Link href={item.href} key={item.name + "mobile"}>
                <a
                  className="pl-6 hover:bg-gray-100 py-3 px-2 rounded-lg"
                  onClick={() => {
                    setOpenMobileDropDown(false);
                  }}
                >
                  <i className={item.icon + " mr-3"} />
                  {t(item.name)}
                </a>
              </Link>
            </>
          ))}
        </div>
        {user ? (
          <>
            <div className="flex flex-col p-3">
              <Link href={`/me`}>
                <a
                  onClick={() => {
                    setOpenMobileDropDown(false);
                  }}
                  className="pl-6 hover:bg-gray-100 py-3 px-2 rounded-lg"
                >
                  <i className="fas fa-user mr-3" />
                  {user.username}
                  {t("navbar.usersInfo")}
                </a>
              </Link>
              <a
                onClick={() => {
                  setOpenMobileDropDown(false);
                  Logout();
                }}
                className="pl-6 hover:bg-gray-100 py-3 px-2 rounded-lg text-red-500"
              >
                <i className="fas fa-sign-out-alt mr-3" /> {t("navbar.logout")}
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col p-3">
              <a
                onClick={() => {
                  Login();
                  setOpenMobileDropDown(false);
                }}
                className="pl-6 hover:bg-gray-100 py-3 px-2 rounded-lg"
              >
                <i className="fas fa-sign-out-alt mr-3" /> {t("navbar.login")}
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
