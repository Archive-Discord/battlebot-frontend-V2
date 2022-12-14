import { GA_TRACKING_ID } from "@utils/googleAnalytics";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head>
          <link rel="canonical" href="https://battlebot.kr/" />
          <meta name="google" content="notranslate" />
          <meta
            name="naver-site-verification"
            content="f412f6cdd3414903f80ff894c167108287c29e8d"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Dosis:wght@800&family=Noto+Sans+KR&family=Open+Sans:wdth,wght@86,800&display=swap"
            rel="stylesheet"
          />
          {/** fontawesome CDN */}
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
            integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
            crossOrigin="anonymous"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
                    window.location = 'microsoft-edge:' + window.location;
                    setTimeout(function() {
                    window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
                    }, 1);
                }
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                var w = window;
                if (w.ChannelIO) {
                  return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
                }
                var ch = function() {
                  ch.c(arguments);
                };
                ch.q = [];
                ch.c = function(args) {
                  ch.q.push(args);
                };
                w.ChannelIO = ch;
                function l() {
                  if (w.ChannelIOInitialized) {
                    return;
                  }
                  w.ChannelIOInitialized = true;
                  var s = document.createElement('script');
                  s.type = 'text/javascript';
                  s.async = true;
                  s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                  s.charset = 'UTF-8';
                  var x = document.getElementsByTagName('script')[0];
                  x.parentNode.insertBefore(s, x);
                }
                if (document.readyState === 'complete') {
                  l();
                } else if (window.attachEvent) {
                  window.attachEvent('onload', l);
                } else {
                  window.addEventListener('DOMContentLoaded', l, false);
                  window.addEventListener('load', l, false);
                }
              })();
              ChannelIO('boot', {
                "pluginKey": "ef6b4a36-5876-4143-a2d3-bc8defa9fff7"
              });`,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "d83w50itqx");
              `,
            }}
          />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2701426579223876"
            crossOrigin="anonymous"
          />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
            `,
            }}
          />
        </Head>
        <body id="body" className="body">
          <Main />
        </body>
        <NextScript />
      </Html>
    );
  }
}
