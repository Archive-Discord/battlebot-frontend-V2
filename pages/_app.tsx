import type { AppContext, AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import AOS from "aos";
import { useEffect } from "react";
import Footer from "../components/Footer";
import FlareLane from "@flarelane/flarelane-web-sdk";
import { cookieParser } from "@utils/utils";

import "../styles/globals.css";
import "aos/dist/aos.css";
import App from "next/app";

function BattlebotApp({ Component, pageProps, auth }: BattlebotAppProps) {
  const router = useRouter();

  useEffect(() => {
    FlareLane.setCurrentPath(router.asPath);
  }, [router.events]);

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
      <Navbar auth={auth} />
      {router.asPath === "/" ?? <hr className="pt-20 border-none" />}
      <Component {...pageProps} />
      {!router.asPath.startsWith("/dashboard/") && <Footer />}
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
    };
  }
  return {
    ...appProps,
    auth: undefined,
  };
};

interface BattlebotAppProps extends AppProps {
  auth: string;
}
export default BattlebotApp;
