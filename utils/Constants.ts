import type { Item, SideBarItem } from "@types";

export const NavBarItems = [
  {
    name: "홈",
    href: "/",
    icon: "fas fa-home",
  },
  {
    name: "프리미엄",
    href: "/premium",
    icon: "fas fa-crown",
  },
  {
    name: "대시보드",
    href: "/dashboard",
    icon: "fas fa-chart-line",
  },
];

export const SideBarItems: SideBarItem[] = [
  {
    name: "대시보드",
    path: "/",
    pathName: "/dashboard/[guild_id]",
    categori: "none",
    icon: "fas fa-home",
  },
  {
    name: "프리미엄",
    path: "/premium",
    pathName: "/dashboard/[guild_id]/premium",
    categori: "none",
    icon: "fas fa-crown",
  },
  {
    name: "통계",
    path: "/analytics",
    pathName: "/dashboard/[guild_id]/analytics",
    categori: "none",
    icon: "fas fa-chart-line",
  },
  {
    name: "자동관리",
    path: "/automod",
    pathName: "/dashboard/[guild_id]/automod",
    categori: "server_manage",
    icon: "fas fa-sync-alt",
  },
  {
    name: "유저관리",
    path: "/members",
    pathName: "/dashboard/[guild_id]/members",
    categori: "server_manage",
    icon: "fas fa-users",
  },
  {
    name: "티켓",
    path: "/ticket",
    pathName: "/dashboard/[guild_id]/ticket",
    categori: "utils",
    icon: "fas fa-credit-card",
  },
];

export const premiumItems = [
  {
    name: "선택 가능한 다양한 인증 방식",
    type: ["month", "year"],
  },
  {
    name: "선택 가능한 추가적인 자동관리",
    type: ["month", "year"],
  },
  {
    name: "서버만의 커스텀 링크",
    type: ["month", "year"],
  },
  {
    name: "클레이튼 기반 NFT 홀더 인증",
    type: ["month", "year"],
  },
  {
    name: "프리미엄 적용 서버 변경",
    type: ["year"],
  },
];

export const payMethods: Item[] = [
  {
    id: "battlepay",
    name: "배틀페이",
    icon: "fas fa-credit-card",
  },
  {
    id: "cultureland",
    name: "문화상품권",
    icon: "fas fa-gift",
  },
];

export const EndPoints = {
  Discord: {
    API: "https://discord.com/api",
    CDN: "https://cdn.discordapp.com",
  },
};

export const battlebot = {
  invite:
    "https://discord.com/oauth2/authorize?client_id=928523914890608671&permissions=8&scope=bot%20applications.commands",
};