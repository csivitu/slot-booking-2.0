import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { customErrorDescriptions, customErrors } from "../constants";
import { User } from "../entities";
import { verifyAccessToken } from "../helpers/jwtFuncs";
import { GravitasUserType, ScopeTypes } from "../types/accountsUserType";
import list from "../helpers/registered";
import serializeError from "../helpers/serializeError";
import { errorLog } from "../helpers/logger";

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
      const registeredList = <GravitasUserType[]>list;
      const registeredUser = registeredList.find(
        (usr) =>
          usr["E-Mail"].toLowerCase() === payload.email.toLocaleLowerCase()
      );
      if (!registeredUser && !payload.scope.includes(ScopeTypes.ADMIN)) {
        return next({
          ...customErrors.notAuthorized(customErrorDescriptions.notRegistered),
          error: new Error(customErrorDescriptions.notRegistered),
        });
      }
      //create user
      user = await userModel.create({
        username: payload.username,
        email: payload.email,
        name: payload.name,
        scope: payload.scope,
        isPaid:
          payload.scope.includes(ScopeTypes.ADMIN) ||
          (registeredUser && registeredUser["Payment Status"] === "Paid"),
      });
    }
    req.user = <User>user;
    next();
  } catch (error) {
    errorLog.error(serializeError(error));
    next({
      ...customErrors.notAuthorized(customErrorDescriptions.invalidJWTToken),
      error,
    });
  }
});

export default authMiddleware;
