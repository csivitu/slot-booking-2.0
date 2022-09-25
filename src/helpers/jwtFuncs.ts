import { verify } from "jsonwebtoken";
import { config } from "../config";
import { ScopeTypes } from "../types/accountsUserType";
import { payloadSchema } from "./validationSchemas";

export const verifyAccessToken = async (token: string) => {
  const payload = verify(token, config.jwt.secret);
  if (typeof payload === "string") {
    throw new Error("Invalid token");
  }
  await payloadSchema.validateAsync(payload);
  return <{ name: string; email: string; scopes: ScopeTypes[] }>payload;
};
