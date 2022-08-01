import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "../components/Footer";
import FlareLane from "@flarelane/flarelane-web-sdk";
import cookie from "cookie";
import { cookieParser } from "@utils/utils";

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

BattlebotApp.getInitialProps = async (ctx: AppContext) => {
  if (ctx && ctx.ctx && ctx.ctx.req) {
    const cookies = cookieParser(ctx.ctx);
    if (cookies && cookies.Authorization) {
      return {
        auth: cookies.Authorization
      };
    }
  }
  return {
    auth: undefined
  };
};

interface BattlebotAppProps extends AppProps {
  auth: string;
}
export default BattlebotApp;
