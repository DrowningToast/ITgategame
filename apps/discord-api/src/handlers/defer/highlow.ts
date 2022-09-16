import { APIApplicationCommandNumberOption, Routes } from "discord.js";
import { axiosBackendInstance } from "../../api/instance";
import EncodeObject from "../../cred/encode";
import { DeferCommandHandler } from "../handler";

interface IGameInstance {
  owner: string;
  price: number;
  joined: number;
  messageId: string;
  onGoing: boolean;
  high: string[];
  low: string[];
}

export const DeferCreateHighLowInstanceCommand: DeferCommandHandler = async (
  message,
  rest
) => {
  try {
    const priceParam = message.data.options?.find(
      (param) => param.name === "cost"
    ) as {
      name: "cost";
      type: 10;
      value: number;
    };

    const response = await axiosBackendInstance.post<IGameInstance>(
      "/casino/highlow",
      {
        jwt: await EncodeObject({
          creatorId: message.member?.user.id,
          price: priceParam.value,
          messageId: message.id,
        }),
      }
    );

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**เกมไฮโลได้เริ่มขึ้นแล้วจ้า!! ${"`/hl-bet`"} พร้อมเลือกมาว่าสูงหรือต่ำ ค่าเข้าเกมเพียง ${
            priceParam.value
          } token(s)** :tada::tada::tada:`,
        },
      }
    );
  } catch (e) {
    console.log(e.response);
    console.log(e.response.data);
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

export const DeferJoinHighLowInstanceCommand: DeferCommandHandler = async (
  message,
  rest
) => {
  try {
    const { value: choice } = message.data.options?.find(
      (option) => option.name === "choice"
    ) as
      | {
          name: "choice";
          value: "HIGH";
        }
      | {
          name: "choice";
          value: "LOW";
        };

    console.log(choice);

    const response = await axiosBackendInstance.patch<IGameInstance>(
      "/casino/highlow/join",
      {
        jwt: await EncodeObject({
          side: choice,
          requesterId: message.member?.user.id,
        }),
      }
    );

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `<@${
            message.member?.user.id
          }>  ได้เข้าร่วมเกมไฮโลแล้ว! ตอนนี้มีทั้งหมด ${
            response.data.joined + 1
          } คน! /hl-bet เพื่อเข้าร่วมตอนนี้เลย!`,
        },
      }
    );
  } catch (e) {
    console.log(e.response.data);
    if (e.status === 404 && e.response.data === "Insufficient balance") {
      return await rest.patch(
        Routes.webhookMessage(process.env.APP_ID!, message.token),
        {
          body: {
            content: `นี่ ไม่ต้องเข้าเลยแกอะ แกตังค์ไม่พอนะรู้ไหม ไปเล่นเกมหาเงินก่อน!`,
          },
        }
      );
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

export const DeferEndHighLowInstanceCommand: DeferCommandHandler = async (
  message,
  rest
) => {
  try {
    const sideParam = message.data.options?.find(
      (option) => option.name === "side"
    ) as
      | {
          name: "side";
          value: "HIGH";
        }
      | {
          name: "side";
          value: "LOW";
        };

    const response = await axiosBackendInstance.patch<{
      instance: IGameInstance;
      winners: string[];
      losers: string[];
    }>("/casino/highlow/end", {
      jwt: await EncodeObject({
        creatorId: message.member?.user.id,
        side: sideParam.value,
      }),
    });

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `เกมไฮโลได้จบลงไปแล้ว!! :tada::tada::tada: มีผู้ชนะทั้งหมด **${
            response.data.winners.length
          }** คน และพวกโดนรับประทานทั้งหมด **${
            response.data.losers.length
          }** คน\n
            ผู้ชนะได้แก่ ${response.data.winners.map((id) => `<@${id}> `)}\n
            ผู้แพ้ได้แก่ ${response.data.losers.map((id) => `<@${id}> `)}
                `,
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
};
