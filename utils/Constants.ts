import type { Item, SideBarItem } from "@types";

export const NavBarItems = [
  {
    name: "navbar.home",
    href: "/",
    icon: "fas fa-home",
  },
  {
    name: "navbar.premium",
    href: "/premium",
    icon: "fas fa-crown",
  },
  {
    name: "navbar.dashboard",
    href: "/dashboard",
    icon: "fas fa-chart-line",
  },
];

export const SideBarItems: SideBarItem[] = [
  {
    name: "dashboard.sidebar.dashboard",
    path: "/",
    pathName: "/dashboard/[guild_id]",
    categori: "none",
    icon: "fas fa-home",
  },
  {
    name: "dashboard.sidebar.premium",
    path: "/premium",
    pathName: "/dashboard/[guild_id]/premium",
    categori: "none",
    icon: "fas fa-crown",
  },
  {
    name: "dashboard.sidebar.analytics",
    path: "/analytics",
    pathName: "/dashboard/[guild_id]/analytics",
    categori: "none",
    icon: "fas fa-chart-line",
  },
  {
    name: "dashboard.sidebar.automod",
    path: "/automod",
    pathName: "/dashboard/[guild_id]/automod",
    categori: "server_manage",
    icon: "fas fa-sync-alt",
  },
  {
    name: "dashboard.sidebar.members",
    path: "/members",
    pathName: "/dashboard/[guild_id]/members",
    categori: "server_manage",
    icon: "fas fa-users",
  },
  {
    name: "dashboard.sidebar.customlink",
    path: "/customlink",
    pathName: "/dashboard/[guild_id]/customlink",
    categori: "server_manage",
    icon: "fas fa-link",
  },
  {
    name: "dashboard.sidebar.ticket",
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
    icon: "/logo.png",
  },
  {
    id: "cultureland",
    name: "문화상품권",
    icon: "/cultureland.png",
  },
  {
    id: "kakaopay",
    name: "카카오페이",
    icon: "/kakaopay.png",
  },
];

export const AutomodTarget: Item[] = [
  {
    id: "message",
    name: "채팅",
    icon: "fas fa-comment",
  },
  {
    id: "user",
    name: "유저",
    icon: "fas fa-user",
  },
  {
    id: "channel",
    name: "채널",
    icon: "fas fa-comment-alt",
  },
];

export const AutomodEvent = [
  {
    id: "blacklist_ban",
    name: "블랙리스트 자동차단",
    categori: "user",
  },
  {
    id: "autorole",
    name: "입장시 역할 자동지급",
    categori: "user",
  },
  {
    id: "usercreateat",
    name: "유저 계정 생성일",
    icon: "fas fa-crown",
    categori: "user",
  },
  {
    id: "usecurse",
    name: "욕설 사용시",
    categori: "message",
  },
  {
    id: "uselink",
    name: "링크 사용시",
    categori: "message",
  },
  {
    id: "resetchannel",
    name: "매일 12시마다 채널 초기화",
    categori: "channel",
  },
];

export const warningTypes = [
  {
    id: "delete",
    name: "메시지 삭제",
  },
  {
    id: "warning",
    name: "메시지 삭제 후 경고지급",
  },
  {
    id: "kick",
    name: "메시지 삭제 후 추방",
  },
  {
    id: "ban",
    name: "메시지 삭제 후 차단",
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
