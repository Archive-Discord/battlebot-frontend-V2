import Head from "next/head";

export default function Seo({ title, description, keyword, image }: SeoProps) {
  return (
    <>
      <Head>
        <title>{"배틀이 - " + title}</title>
        <link rel="canonical" href="https://battlebot.kr" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <meta name="keyword" content={keyword} />
        {/* Open Graph */}
        <meta property="og:site_name" content="배틀이" />
        <meta property="og:image" content={image} />
        <meta property="og:title" content={"배틀이 - " + title} />
        <meta property="og:description" content={description} />
        {/* Twitter */}
        <meta name="twitter:card" content={image} />
        <meta name="twitter:site" content="https://battlebot.kr" />
        <meta name="twitter:title" content={"배틀이 - " + title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>
    </>
  );
}

Seo.defaultProps = {
  title: "하나의 봇으로 모든 관리를",
  description:
    "배틀이 봇과 대시보드를 이용하여 다른 봇 없이 한 번에 서버를 관리해 보세요!",
  keyword:
    "배틀이, Battlebot, 디스코드 서버, 디스코드 서버 검색, 디스코드 니트로, 디스코드 웹, 디스코드 서버찾기, 디스코드 전적이, 디스코드 배틀이, 디스코드 봇 추천, 디스코드 봇 리스트, 디스코드 봇, 디스코드 봇 만들기",
  image: "https://battlebot.kr/logo.png",
};

interface SeoProps {
  title?: string;
  description?: string;
  keyword?: string;
  image?: string;
}
