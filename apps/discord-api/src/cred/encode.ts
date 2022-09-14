import jsonwebtoken from "jsonwebtoken";

const EncodeObject = async (payload: object) => {
  if (!process.env.BACKEND_TOKEN) throw new Error("MISSING BACKEND TOKEN");

  return await jsonwebtoken.sign(payload, process.env.BACKEND_TOKEN, {
    algorithm: "HS256",
  });
};

export default EncodeObject;
