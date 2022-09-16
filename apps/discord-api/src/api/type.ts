// export const interface body {

// }

export interface Data {
  guild_id: string;
  id: string;
  name: string;
  type: number;
}

export interface User {
  avatar: string;
  avatar_decoration?: any;
  discriminator: string;
  id: string;
  public_flags: number;
  username: string;
}

export interface Member {
  avatar?: any;
  communication_disabled_until?: any;
  deaf: boolean;
  flags: number;
  is_pending: boolean;
  joined_at: string;
  mute: boolean;
  nick: string;
  pending: boolean;
  permissions: string;
  premium_since?: any;
  roles: string[];
  user: User;
}

export interface body {
  app_permissions: string;
  application_id: string;
  channel_id: string;
  data: Data;
  guild_id: string;
  guild_locale: string;
  id: string;
  locale: string;
  member: Member;
  token: string;
  type: number;
  version: number;
}

export interface iUser {
  email: string;
  balance: number;
  uid: string;
  gate: string;
  firstName: string;
  lastName: string;
  userName: string;
  id: string;
  year: number;
  activated: boolean;
  role: "Player" | "Admin" | "Agency";
  discordId: string;
}
