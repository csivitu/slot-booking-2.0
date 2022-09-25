import { RequestHandler } from "express";
import Joi from "joi";
import { customErrorDescriptions, customErrors } from "../constants";
import RequestProperties from "../types/requestProperties";

const handleValidation = (schema: Joi.Schema, property: RequestProperties) => {
  const validate: RequestHandler = async (req, res, next) => {
    try {
      const value = <unknown>(await schema.validateAsync(req[property]));

      req[property] = value;

      next();
    } catch (error) {
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
  };

  return validate;
};

export default handleValidation;
