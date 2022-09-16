import { Routes } from "discord.js";
import { createTempAccount, onewayRequest } from "../../api/helper";
import { axiosBackendInstance } from "../../api/instance";
import EncodeObject from "../../cred/encode";
import { DeferCommandHandler } from "../handler";

const updateAndResponse: DeferCommandHandler = async (message, rest) => {
  const targetParam = message.data.options!.find(
    (obj) => obj.name === "target"
  ) as {
    name: "target";
    value: string;
    type: 6;
  };

  // Check if the user is legit or not

  const amountParam = message.data.options!.find(
    (obj) => obj.name === "amount"
  ) as {
    name: "amount";
    value: number;
    type: 4;
  };

  // Check if the user is valid or not
  const res = await axiosBackendInstance.post("/discord/grant", {
    jwt: await EncodeObject({
      requesterDiscordId: message.member?.user.id,
      discordId: targetParam.value,
      amount: amountParam.value,
    }),
  });

  const response = await rest.patch(
    Routes.webhookMessage(process.env.APP_ID!, message.token),
    {
      body: {
        content: `เรียบร้อย! ให้คะแนน <@${targetParam.value}> ทั้งหมด ${amountParam.value} token(s) เรียบร้อยแว้ว >.>`,
      },
    }
  );
};

const DeferGrantCommand: DeferCommandHandler = async (message, rest) => {
  try {
    await updateAndResponse(message, rest);
  } catch (e) {
    const targetParam = message.data.options!.find(
      (obj) => obj.name === "target"
    ) as {
      name: "target";
      value: string;
      type: 6;
    };

    if (e.response.status === 404) {
      // Call create temp function
      await createTempAccount(message, rest, targetParam.value);
      const res = await onewayRequest(
        `${process.env.Prod_Endpoint ?? process.env.Dev_Endpoint}/defer`,
        {
          message,
        },
        "POST"
      );
      return;
    }
    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**Failed to update user tokens** Reason: ${e.response.data}`,
        },
      }
    );
  }
};
export default DeferGrantCommand;
