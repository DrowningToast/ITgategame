import { Routes } from "discord.js";
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
      let gate: "AND" | "OR" | "NOR" | "NOT" | null = null;

      // Check which gate are they on
      if (message.member?.roles.includes("1011597325036167268")) {
        gate = "AND";
      } else if (message.member?.roles.includes("1011597458805096492")) {
        gate = "OR";
      } else if (message.member?.roles.includes("1011597601088471100")) {
        gate = "NOR";
      } else if (message.member?.roles.includes("1011597674249715833")) {
        gate = "NOT";
      }

      if (!gate) {
        await rest.patch(
          Routes.webhookMessage(process.env.APP_ID!, message.token),
          {
            body: {
              content: `**Failed to update user tokens** Reason: Target missing a unqiue gate role`,
            },
          }
        );
        return;
      }

      await axiosBackendInstance.post("/discord/create", {
        jwt: await EncodeObject({
          discordId: targetParam.value,
          gate,
        }),
      });

      await updateAndResponse(message, rest);
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
