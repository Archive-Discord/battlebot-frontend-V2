import { EndPoints } from "./Constants"
import cookie from "cookie"
import { GetServerSidePropsContext, NextPageContext } from "next"
import type { Guild, User as DiscordUser } from "discord.js"
import { UserGuld, Guild as BattlebotGuild } from "@types"

export const classNames = (...classes: any) => {
    return classes.filter(Boolean).join(' ')
}

export const userAvaterLink = (user: DiscordUser): string => {
    if(!user.avatar) return `${EndPoints.Discord.CDN}/embed/avatars/${Number(user.discriminator) % 5}.png`
    return `${EndPoints.Discord.CDN}/avatars/${user.id}/${user.avatar}`
}

export const guildProfileLink = (guild: UserGuld | Guild | BattlebotGuild): string => {
    if(!guild.icon) return `${EndPoints.Discord.CDN}/embed/avatars/1.png`
    return `${EndPoints.Discord.CDN}/icons/${guild.id}/${guild.icon}`
}

export const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const cookieParser = (ctx: GetServerSidePropsContext|NextPageContext) => {
    if(!ctx ||!ctx.req || !ctx.req.headers || !ctx.req.headers.cookie) return undefined;
    const cookies = cookie.parse(ctx.req.headers.cookie as string);
    return cookies
}