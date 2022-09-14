import { AxiosInstance } from "axios";

/**
 * @description Attach the firebase token to every request to the backend
 * @param instance
 * @param bearer
 */
export const SetHeaderToken = (instance: AxiosInstance, token: string) => {
  instance.defaults.headers.common["token"] = token;
};

import https from "https";
import http from "http";
import URL from "url";

export async function onewayRequest(url: string, data, method = "GET") {
  return new Promise((resolve, reject) => {
    try {
      let dataEncoded = JSON.stringify(data);
      let req: http.ClientRequest;
      if (process.env.Prod_Endpoint) {
        console.log("HTTPSING");
        req = https.request({
          ...URL.parse(url),
          method,
          headers: {
            "Content-Length": Buffer.byteLength(dataEncoded),
            "Content-Type": "application/json",
          },
        });
      } else {
        req = http.request({
          ...URL.parse(url),
          method,
          headers: {
            "Content-Length": Buffer.byteLength(dataEncoded),
            "Content-Type": "application/json",
          },
        });
      }
      req.method = method;
      req.write(JSON.stringify(data));
      req.end(() => {
        /* Request has been fully sent */
        resolve(req);
      });
    } catch (e) {
      console.log("Something went wrong");
      console.log(e);
      reject(e);
    }
  });
}
