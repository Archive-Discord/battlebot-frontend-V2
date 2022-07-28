import { EndPoints } from "./Constants"

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export const userAvaterLink = (user: any): string => {
    if(!user.avatar) return `${EndPoints.Discord.CDN}/embed/avatars/${Number(user.discriminator) % 5}.png`
    return `${EndPoints.Discord.CDN}/avatars/${user.id}/${user.avatar}`
}

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}