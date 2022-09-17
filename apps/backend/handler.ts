import serverless from "serverless-http";

import app from "./app";
import { onBroadcast, onConnect, onDisconnect } from "./websocket/wshandler";

const handler: serverless.Handler = async (event, context) => {
  const {
    requestContext: { routeKey },
  } = event;
  switch (routeKey) {
    case "$connect":
      return await onConnect(event, context);

    case "$disconnect":
      return await onDisconnect(event, context);

    case "broadcast":
      return await onBroadcast(event, context);
  }

  return await serverless(app)(event, context);
};

module.exports.handler = handler;
// module.exports.handler = serverless(app);

// module.exports.handler = async (
//   event: AWSLambda.APIGatewayProxyEvent | AWSLambda.APIGatewayProxyEventV2,
//   context: AWSLambda.Context
// ): Promise<AWSLambda.APIGatewayProxyResult | AWSLambda.APIGatewayProxyStructuredResultV2> => {
//   if (event.)
// };
