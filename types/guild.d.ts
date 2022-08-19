import type { GuildTextBasedChannel, CategoryChannel, Role, RESTAPIPartialCurrentUserGuild, User, Embed } from "discord.js"

export interface Guild {
    id: string;
    name: string;
    memberCount: number;
    icon: string;
    channels: GuildTextBasedChannel[];
    categories: CategoryChannel[];
    roles: Role[];
    tickets: number;
    verifys: number;
}

export interface Members {
  joinedTimestamp: Date;
  roles: Role[]
  user: User;
}

export interface Roles {
  id: string,
  icon: string
  color: number
  name: string
  members: number
}

export interface Ticket {
  _id: string;
  status: string;
  guildId: string;
  userId: string;
  ticketId: string;
  published_date?: Date;
  messages: TicketMessage[];
}

export interface TicketMessage {
  author: object | string;
  created: Date;
  messages: string;
  embed: Embed;
}

export interface CustomLinkList {
  custom: CustomLink;
  random: CustomLink[]
}

export interface CustomLink {
  guild_id: string;
  path: string;
  useage: number;
  type: "custom" | "random";
  option: "kakao" | "phone" | "email"
  published_date: Date;
}

export interface Automod {
  _id: string
  guildId: string;
  event: AutomodEvent;
  start: string;
}
export type AutomodEvent = "resetchannel" | "blacklist_ban" | "usercreateat" | "usecurse" | "uselink" | "autorole"

export interface UserGuld extends RESTAPIPartialCurrentUserGuild {
    bot: boolean;
  }
  
export type UserGulds = UserGuld[]