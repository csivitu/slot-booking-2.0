import { verify } from "jsonwebtoken";
import { config } from "../config";

export const verifyAccessToken = (token: string) => {
  try {
    const payload = verify(token, config.jwt.secret);
    if (typeof payload === "string") {
      throw new Error("Invalid token");
    }
    return payload as { name: string; email: string };
  } catch (error) {
    throw error;
  }
};
