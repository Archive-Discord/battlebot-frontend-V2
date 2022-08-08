import type { AppContext, AppProps } from "next/app";
import { useRouter } from "next/router";
import { cookieParser } from "@utils/utils";
import { ToastContainer } from 'react-toastify';
import { useEffect } from "react";
import App from "next/app";
import Navbar from "../components/Navbar";
import AOS from "aos";
import Footer from "../components/Footer";
import FlareLane from "@flarelane/flarelane-web-sdk";

import "../styles/globals.css";
import "aos/dist/aos.css";
import 'react-toastify/dist/ReactToastify.css';
import "swiper/css"
import "swiper/css/navigation"

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
      <ToastContainer/>
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
