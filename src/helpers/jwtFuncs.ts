import { verify } from "jsonwebtoken";
import { config } from "../config";

export const verifyAccessToken = (token: string) => {
  try {
    const payload = verify(token, config.jwt.secret);
    if (typeof payload === "string") {
      throw new Error("Invalid token");
    }
    return <{ name: string; email: string }>payload;
  } catch (error) {
    throw error;
  }
};
