import { RequestHandler } from "express";
import { customErrorDescriptions, customErrors } from "../constants";
import { ScopeTypes } from "../types/accountsUserType";

const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.user.scopes.includes(ScopeTypes.ADMIN)) {
    next({
      ...customErrors.notAuthorized(customErrorDescriptions.notAdmin),
      error: new Error(customErrorDescriptions.notAdmin),
    });
    return;
  }
  next();
};

export default requireAdmin;
