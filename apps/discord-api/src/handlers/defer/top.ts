import { Routes } from "discord-api-types/v9";
import { InteractionResponseType } from "discord-interactions";
import { axiosBackendInstance } from "../../api/instance";
import { iUser } from "../../api/type";
import { CommandHandler, DeferCommandHandler } from "../handler";

const DeferTopCommand: DeferCommandHandler = async (message, rest) => {
  try {
    const response = await axiosBackendInstance.get<iUser[]>(`/discord/top`);

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**อันดับ 5 คนที่รวยที่สุดตอนนี้**\n${response.data.map(
            (user) => {
              return `<@${user.discordId}> มีอยู่ **${user.balance}** tokens\n`;
            }
          )}`,
        },
      }
    );
  } catch (e) {
    console.log(e);
    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**ไม่นะ! บอทมันก่องก้อง บัครับประทาน ลองติดต่อ Staff ดูน้า** เหตุผล: ${e?.response?.data}`,
        },
      }
    );
  }
};

export default DeferTopCommand;
