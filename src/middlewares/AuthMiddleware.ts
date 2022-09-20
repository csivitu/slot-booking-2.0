import { RequestHandler } from "express";
import { customErrorDescriptions, customErrors } from "../constants";
import { verifyAccessToken } from "../helpers/jwtFuncs";

const decodeJWT: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers as { authorization: string };

  if (!authorization) {
    return res.status(403).json({
      ...customErrors.notAuthorized(
        customErrorDescriptions.noAuthorizationHeader
      ),
      error: new Error(customErrorDescriptions.noAuthorizationHeader),
    });
  }

  try {
    const payload = verifyAccessToken(authorization);
    req.user = payload;
  } catch (error) {
    next({
      ...customErrors.notAuthorized(
        customErrorDescriptions.invalidJWTToken
      ),
      error,
    });
  }
};

export default decodeJWT;
