import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import AOS from "aos";
import "aos/dist/aos.css"
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 500,
    });
  }, []);
  const routuer = useRouter()
  return <>
    <Navbar />
    {routuer.asPath === "/" ?? <hr className='pt-20 border-none'/>}
    <Component {...pageProps} />
  </>
}

export default MyApp
