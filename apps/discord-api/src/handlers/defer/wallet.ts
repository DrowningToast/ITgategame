import { AxiosError } from "axios";
import { Routes } from "discord-api-types/v9";
import { InteractionResponseType } from "discord-interactions";
import { createTempAccount } from "../../api/helper";
import { axiosBackendInstance } from "../../api/instance";
import { CommandHandler, DeferCommandHandler } from "../handler";

const DeferWalletCommand: DeferCommandHandler = async (message, rest) => {
  const discordId = message.member?.user.id;

  const targetParam = message.data.options?.find(
    (obj) => obj.name === "target"
  ) as {
    name: "target";
    value: string;
    type: 6;
  };

  try {
    const response = await axiosBackendInstance.get<{
      balance: number;
      discordId: string;
    }>(`/discord/wallet/${targetParam?.value ?? discordId}`);

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `<@${
            targetParam?.value ?? discordId
          }> ตอนนี้เจ้ามี tokens อยู่ ${response.data.balance ?? 0} ${
            response.data.discordId
              ? ""
              : "(นายยังไม่ได้เชื่อมกับบัตรบน website น้า ถ้ามีบัญชีบนเว็บสามารถ /link เพื่อเชื่อมได้เลยนะ)"
          }`,
        },
      }
    );
  } catch (e) {
    console.log(e);

    if (e.status === 404) {
      try {
        await createTempAccount(message, rest, discordId!);
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `<@${
                targetParam?.value ?? discordId
              }> ตอนนี้เจ้ามี tokens อยู่ 0 (นายยังไม่ได้เชื่อมกับบัตรบน website น้า ถ้ามีบัญชีบนเว็บสามารถ /link เพื่อเชื่อมได้เลยนะ)`,
            },
          }
        );
      } catch (e) {
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `**ไม่นะ! บอทมันก่องก้อง บัครับประทาน ลองติดต่อ Staff ดูน้า** เหตุผล: ${e?.response?.data}`,
            },
          }
        );
      }
    }

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

export default DeferWalletCommand;
