import { FunctionComponent } from "react";

export interface PageDefaultProps {
    auth: string,
    guildId?: string
    error?: boolean
    message?: string
    status?: number
    orderId?: string
    data?: any
}
export interface SideBarItem {
    name: string
    path: string
    pathName: string
    categori: SideBarCategoris
    icon: string
    premium?: boolean
}
export interface Item {
    id: string;
    name: string;
    icon?: string;
  }

  export interface BattleBotEmbed {
    color?: string;
    title?: string;
    description?: string;
  }

  export type SideBarCategoris = "server_manage" | "utils" | "alert" | "none"
  export type PayMethods = "cultureland" | "battlepay" | "kakaopay"
  export type Theme = "dark" | "light"