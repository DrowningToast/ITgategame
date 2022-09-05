import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.project_id,
      privateKey: process.env.private_key
        ? process.env.private_key.replace(/\\n/gm, "\n")
        : undefined,
      clientEmail: process.env.client_email,
    }),
  });
}

const validateAuth = async (req, res, next) => {
  const header = req.headers?.authorization;
  if (
    header !== "Bearer null" &&
    req.headers?.authorization?.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const deocdeToken = await admin.auth().verifyIdToken(idToken);
      console.log("The user verified");
      req["currentUser"] = deocdeToken;
      return next();
    } catch (err) {
      console.log("Error while trying to verifying user");
      console.log(err);
      return next();
    }
  }
  return next();
};

export default validateAuth;
