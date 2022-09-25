import { RequestHandler } from "express";
import { customErrorDescriptions, customErrors } from "../constants";

const requireUser: RequestHandler = (req, res, next) => {
  if (!req.user) {
    next({
      ...customErrors.notAuthorized(customErrorDescriptions.unableToDecodeJWT),
      error: new Error(customErrorDescriptions.unableToDecodeJWT),
    });
    return;
  }
  next();
};

export default requireUser;
