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

export const EndPoints = {
    Discord: {
        API: 'https://discord.com/api',
        CDN: 'https://cdn.discordapp.com',
    }
}

export const battlebot = {
  invite: "https://discord.com/oauth2/authorize?client_id=928523914890608671&permissions=8&scope=bot%20applications.commands"
}