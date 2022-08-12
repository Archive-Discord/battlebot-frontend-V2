import type { AppContext, AppProps } from "next/app";
import type { Theme } from "@types";
import { useRouter } from "next/router";
import { cookieParser } from "@utils/utils";
import { ToastContainer } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";
import App from "next/app";
import Navbar from "../components/Navbar";
import AOS from "aos";
import Footer from "../components/Footer";
import FlareLane from "@flarelane/flarelane-web-sdk";
import createI18n from "@components/createI18n";
import Seo from "@components/Seo";

import "../styles/globals.css";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";

function BattlebotApp({
  Component,
  pageProps,
  auth,
  locale,
}: BattlebotAppProps & { locale: string }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>();
  const i18n = useMemo(() => createI18n({ locale }), [locale]);

  useEffect(() => {
    const nowTheme = localStorage.getItem("theme");
    const body = document.getElementById("body");
    if (nowTheme === "dark") {
      body?.classList.add("dark");
      setTheme("dark");
    } else {
      body?.classList.remove("dark");
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    const body = document.getElementById("body");
    if (theme === "dark") {
      body?.classList.add("dark");
      localStorage.setItem("theme", theme);
    } else if (!theme || theme === "light") {
      body?.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const themeHanler = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {
    FlareLane.setCurrentPath(router.asPath);
  }, [router.asPath, router.events]);

  useEffect(() => {
    //FlareLane.initialize({
    //  projectId: "7926d4f1-fbdb-4db9-bcc7-62fec4f86224",
    //});
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 500,
    });
  }, []);
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <Seo />
        <Navbar auth={auth} />
        {router.asPath === "/" ?? <hr className="pt-20 border-none" />}
        <Component {...pageProps} />
        {!router.asPath.startsWith("/dashboard/") && (
          <Footer themeHanler={themeHanler} theme={theme ? theme : "light"} />
        )}
        <ToastContainer />
      </I18nextProvider>
    </>
  );
}

BattlebotApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const cookies = cookieParser(appContext.ctx);
  if (cookies && cookies.Authorization) {
    return {
      ...appProps,
      auth: cookies.Authorization,
      locale: appContext.ctx.locale,
    };
  }
  return {
    ...appProps,
    auth: undefined,
    locale: appContext.ctx.locale,
  };
};

interface BattlebotAppProps extends AppProps {
  auth: string;
}
export default BattlebotApp;
