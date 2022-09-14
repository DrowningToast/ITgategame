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

var options = {
  hostname: "www.postcatcher.in",
  port: 80,
  path: "/catchers/5531b7faacde130300002495",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export async function onewayRequest(url: string, data, method = "GET") {
  return new Promise((resolve, reject) => {
    try {
      let dataEncoded = JSON.stringify(data);
      let req: http.ClientRequest;
      if (url.slice(0, 6) === "https") {
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
