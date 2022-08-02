import { SideBarItem } from "types/battlebot";

export const NavBarItems = [
  {
    name: "홈",
    href: "/",
    icon: "fas fa-home"
  },
  {
    name: "프리미엄",
    href: "/premium",
    icon: "fas fa-crown"
  },
  {
    name: "대시보드",
    href: "/dashboard",
    icon: "fas fa-chart-line"
  },
];

export const SideBarItems: SideBarItem[] = [{
  name: "대시보드",
  path: "/",
  pathName: "/dashboard/[guild_id]",
  categori: "none",
  icon: "fas fa-home"
},
{
  name: "프리미엄",
  path: "/premium",
  pathName: "/dashboard/[guild_id]/premium",
  categori: "none",
  icon: "fas fa-crown"
}]

export const premiumItems = [{
  name: "선택 가능한 다양한 인증 방식",
  type: ["month", "year"]
},{
  name: "선택 가능한 추가적인 자동관리",
  type: ["month", "year"]
},{
  name: "서버만의 커스텀 링크",
  type: ["month", "year"]
},{
  name: "클레이튼 기반 NFT 홀더 인증",
  type: ["month", "year"]
},{
  name: "프리미엄 적용 서버 변경",
  type: ["year"]
},]

export const EndPoints = {
    Discord: {
        API: 'https://discord.com/api',
        CDN: 'https://cdn.discordapp.com',
    }
}

export const battlebot = {
  invite: "https://discord.com/oauth2/authorize?client_id=928523914890608671&permissions=8&scope=bot%20applications.commands"
}