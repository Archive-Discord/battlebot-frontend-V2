import { FunctionComponent } from "react";

export interface PageDefaultProps {
    auth: string,
    guildId?: string
}

export type SideBarCategoris = "server_manage" | "utils" | "alert" | "none"
export interface SideBarItem {
    name: string
    path: string
    pathName: string
    categori: SideBarCategoris
    icon: string
    premium?: boolean
}