import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import User, { iUser } from "../models/User";

export interface validateRoleError extends Error {
  message: string;
  code?: number;
}

/**
 *
 * @param {Promise<DecodedIdToken>} user
 * @param {[ "Player" | "Admin" | "Agency"]} requiredRole
 * @returns
 */
const validateRole = async (
  user: DecodedIdToken | undefined,
  requiredRoles?: string[],
  bypassDatabaseSearch: boolean = false
): Promise<(DecodedIdToken & iUser) | DecodedIdToken> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = await User.findOne({ uid: user?.uid });
      if ((!user || !userData || !userData?.role) && bypassDatabaseSearch) {
        reject({ code: 401, message: "Not Authorized" });
      } else if (
        requiredRoles?.length &&
        userData?.role &&
        !requiredRoles?.includes(userData.role)
      ) {
        reject({ code: 403, message: "Insufficient Permission" });
      } else if (userData) {
        resolve({ ...user, ...userData?.toObject() });
      } else {
        //@ts-ignore
        resolve({
          ...user,
        });
      }
    } catch (e) {
      reject({ code: 500, message: "Unknown validation error" });
    }
  });
};

export default validateRole;
