import * as AWS from "aws-sdk";

export const sendWSData = async (event, message: string) => {
  let connectionData;

  const dbClient = new AWS.DynamoDB.DocumentClient();
  try {
    connectionData = await dbClient
      .scan({
        TableName: "itgg-ws-connections",
        ProjectionExpression: "connectionId",
      })
      .promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  console.log(
    event?.requestContext.domainName + "/" + event?.requestContext.stage
  );

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: "cz1312nzoj.execute-api.ap-southeast-1.amazonaws.com/dev",
    // process.env.NODE_ENV === "development"
    //   ? "http://localhost:4001"
    //   : event?.requestContext.domainName + "/" + event?.requestContext.stage,
  });
  try {
    const postData = JSON.parse(message!);

    for (const { connectionId } of connectionData.Items) {
      try {
        console.log("Sending to:", connectionId);
        const params = {
          ConnectionId: connectionId,
          Data: Buffer.from(JSON.stringify(postData)),
        };
        const res = await apigwManagementApi.postToConnection(params).promise();
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${connectionId}`);
          await dbClient
            .delete({
              TableName: "itgg-ws-connections",
              Key: { connectionId },
            })
            .promise();
        } else {
          throw e;
        }
      }
    }
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }
};
