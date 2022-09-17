import * as AWS from "aws-sdk";
import { APIGatewayEvent } from "aws-lambda";
import { sendWSData } from "./sendWSData";
import User from "../models/User";

export const onConnect = async (event, context) => {
  const connectionId = event.requestContext.connectionId;
  const dbClient = new AWS.DynamoDB.DocumentClient();

  const putParams = {
    TableName: "itgg-ws-connections",
    Item: {
      connectionId: connectionId,
    },
  };
  try {
    await dbClient.put(putParams).promise();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  return {
    statusCode: 200,
  };
};

export const onDisconnect = async (event, context) => {
  console.log(event);

  const connectionId = event.requestContext.connectionId;
  const dbClient = new AWS.DynamoDB.DocumentClient();
  const delParams = {
    TableName: "itgg-ws-connections",
    Key: {
      connectionId: connectionId,
    },
  };
  try {
    await dbClient.delete(delParams).promise();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  return {
    statusCode: 200,
  };
};

export const onBroadcast = async (event, context) => {
  const body = JSON.parse(event.body!);

  await sendWSData(event, event.body);

  return { statusCode: 200, body: "Data sent." };
};

export const onDefault = async (event) => {
  try {
    console.log(typeof event.body);
    const body = JSON.parse(event.body);
    console.log(body);
  } catch (e) {
    console.log(e);
  }
  return {
    statusCode: 200,
  };
};
