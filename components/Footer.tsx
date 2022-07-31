import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer
        className="w-full bottom-0 bg-whtie border-t text-black"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="container p-10">
          <ul className="flex lg:flex-row flex-col lg:justify-start items-center lg:space-x-4 text-lg flex-wrap">
            <li>
              <Link href={"/tos"}>
                <a>이용약관</a>
              </Link>
            </li>
            <li>
              <Link href={"/privacy"}>
                <a>개인정보처리방침</a>
              </Link>
            </li>
            <li>
              <a href={"https://help.archiver.me/"} target={"_blank"}>
                이용 가이드
              </a>
            </li>
            <li>
              <a
                href={"https://recruit.archiver.me/"}
                target={"_blank"}
                className="relative inline-flex items-center"
              >
                채용
                <span className="flex absolute h-2 w-2 right-0 lg:-mr-4 -mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-600 opacity-75"/>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"/>
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
          <div className="mt-8 flex w-full space-x-2 lg:justify-start justify-center">
            <a href="https://archiver.me" target={"_blank"}>
              <Image width={"60px"} height={"60px"} src={"/archive_logo.png"} />
            </a>
            <a href="https://discord.com" target={"_blank"}>
              <Image width={"50px"} height={"60px"} src={"/discord_logo.png"} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
