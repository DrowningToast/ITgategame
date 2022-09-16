import { APIGuildMember } from "discord.js";

export const give100 = "1020201795852697631";
export const take100 = "1020201795143864350";
export const give250 = "1020192797933973524";
export const take250 = "1020201298638950441";
export const give500 = "1020201390133477377";
export const take500 = "1020201391299498125";
export const give1000 = "1020201393035956265";
export const take1000 = "1020201393107251220";
export const give2500 = "1020201797119385610";
export const take2500 = "1020201800055390229";
export const give5000 = "1020201776911233025";
export const take5000 = "1020201794174980168";

export const getTokenFromRole = async (user: APIGuildMember) => {
  let total = 0;
  let tobeRemovedRoles: string[] = [];

  user.roles.forEach((roleId) => {
    tobeRemovedRoles.push(roleId);

    switch (roleId) {
      case give100:
        total += 100;
        break;
      case take100:
        total -= 100;
        break;
      case give250:
        total += 250;
        break;
      case take250:
        total -= 250;
        break;
      case give500:
        total += 500;
        break;
      case take500:
        total -= 500;
        break;
      case give1000:
        total += 1000;
        break;
      case take1000:
        total -= 1000;
        break;
      case give2500:
        total += 2500;
        break;
      case take2500:
        total -= 2500;
        break;
      case give5000:
        total += 5000;
        break;
      case take5000:
        total -= 5000;
        break;
      default:
        tobeRemovedRoles.pop();
        break;
    }
  });

  return { total, roles: tobeRemovedRoles };
};
