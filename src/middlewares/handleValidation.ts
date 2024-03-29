import { RequestHandler } from "express";
import Joi from "joi";
import { customErrorDescriptions, customErrors } from "../constants";
import { errorLog } from "../helpers/logger";
import serializeError from "../helpers/serializeError";
import RequestProperties from "../types/requestProperties";

const handleValidation = (schema: Joi.Schema, property: RequestProperties) => {
  const validate = <RequestHandler>(async (req, res, next) => {
    try {
      const value = <unknown>(
        await schema.validateAsync(req[property], { stripUnknown: true })
      );

      req[property] = value;

      next();
    } catch (error) {
      errorLog.error(serializeError(error));
      if (Joi.isError(error)) {
        next({
          ...customErrors.badRequest(
            `${error.name}: ${error.message} in request ${property}`
          ),
          error,
        });
      }

      next({
        ...customErrors.badRequest(
          customErrorDescriptions.unknownValidationError
        ),
        error,
      });
    }
  });

  return validate;
};

export default handleValidation;
