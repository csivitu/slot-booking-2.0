import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { customErrorDescriptions, customErrors } from "../constants";
import { User } from "../entities";
import { verifyAccessToken } from "../helpers/jwtFuncs";

const authMiddleware = <RequestHandler>(async (req, res, next) => {
  const { authorization } = <{ authorization: string }>req.headers;

  if (!authorization) {
    return res.status(403).json({
      ...customErrors.notAuthorized(
        customErrorDescriptions.noAuthorizationHeader
      ),
      error: new Error(customErrorDescriptions.noAuthorizationHeader),
    });
  }

  try {
    const payload = await verifyAccessToken(authorization);
    const userModel = getModelForClass(User);
    let user = await userModel.findOne({ username: payload.username });
    if (!user) {
      //create user
      user = await userModel.create({
        username: payload.username,
        email: payload.email,
        name: payload.name,
        scope: payload.scope,
      });
    }
    req.user = <User>user;
    next();
  } catch (error) {
    next({
      ...customErrors.notAuthorized(customErrorDescriptions.invalidJWTToken),
      error,
    });
  }
});

export default authMiddleware;
