import { Routes } from "discord.js";
import { axiosBackendInstance } from "../../api/instance";
import EncodeObject from "../../cred/encode";
import { DeferCommandHandler } from "../handler";

const DeferGiveCommand: DeferCommandHandler = async (message, rest) => {
  const requesterid = message.member?.user.id;
  const targetParam = message.data.options!.find(
    (obj) => obj.name === "target"
  ) as {
    name: "target";
    value: string;
    type: 6;
  };
  const amountParam = message.data.options!.find(
    (obj) => obj.name === "amount"
  ) as {
    name: "amount";
    value: number;
    type: 4;
  };

  try {
    const requesterWallet = await axiosBackendInstance.get<{
      balance: number;
      discordId: string;
    }>(`/discord/wallet/${requesterid}`);

    if (requesterWallet.data.balance <= 0) {
      await rest.patch(
        Routes.webhookMessage(process.env.APP_ID!, message.token),
        {
          body: {
            content: `<@${requesterid}> แกไม่มีอะไรจะไปให้ใครหรือเอาอะไรมาเป็นหลักประกันทั้งนั้นแล้ว. . .`,
          },
        }
      );
      return;
    }

    const response = await axiosBackendInstance.post("/discord/give", {
      jwt: await EncodeObject({
        discordId: requesterid,
        targetDiscordId: targetParam.value,
        amount: amountParam.value,
      }),
    });

    if (amountParam.value > 0) {
      await rest.patch(
        Routes.webhookMessage(process.env.APP_ID!, message.token),
        {
          body: {
            content: `<@${requesterid}> ได้ให้ token <@${targetParam.value}> เป็นจำนวน ${amountParam.value} token`,
          },
        }
      );
    } else if (amountParam.value < 0) {
      if (response.data.successful) {
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `<@${requesterid}> ได้**ขโมย** token จาก <@${
                targetParam.value
              }> เป็นจำนวน ${amountParam.value * -1} token`,
            },
          }
        );
      } else {
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `ไม่นะ!! <@${requesterid}> ขโมย token **ไม่สำเร็จ**จาก <@${targetParam.value}> แล้วต้องจ่ายค่าทำขวัญเป็นจำนวน ${amountParam.value} ให้กับบอท`,
            },
          }
        );
      }
    }
  } catch (e) {
    console.log(e.response);
    console.log(e.response.data);

    if (e.response.status === 400) {
      if (e.response.data.message === "Insufficient target balance") {
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `นี่. . . แกจะไปขโมยมันตั้ง ${
                amountParam.value * -1
              } ทำไม. . . <@${targetParam.value}>มีแค่ ${
                e.response.data.targetValue
              } token`,
            },
          }
        );
        return;
      } else if (e.response.data.message === "Insufficient requester balance") {
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `นี่เจ้ามีแค่ ${e.response.data.requesterValue} tokens เจ้าจะไปให้<@${targetParam.value}>ตั้ง ${amountParam.value} token`,
            },
          }
        );
        return;
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

export default DeferGiveCommand;
