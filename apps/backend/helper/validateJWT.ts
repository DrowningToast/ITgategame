import jsonwebtoken from "jsonwebtoken";

const ValidateJWT = async (cred: string) => {
  if (!process.env.BACKEND_TOKEN) throw new Error("Missing BACKEND_TOKEN");

  return await jsonwebtoken.verify(cred, process.env.BACKEND_TOKEN, {
    algorithms: ["HS256"],
  });
};

export default ValidateJWT;
