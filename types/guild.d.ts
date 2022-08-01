import type { GuildTextBasedChannel, CategoryChannel, Role, RESTAPIPartialCurrentUserGuild } from "discord.js"

export interface Guild {
    id: string;
    name: string;
    memberCount: number;
    icon: string;
    channels: GuildTextBasedChannel[];
    categories: CategoryChannel[];
    roles: Role[]
}

export interface UserGuld extends RESTAPIPartialCurrentUserGuild {
    bot: boolean;
  }
  
  export type UserGulds = UserGuld[]