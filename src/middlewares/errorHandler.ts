import { ErrorRequestHandler } from "express";
import { ResponseError } from "../types/errorTypes";
import constructErrorObject from "../helpers/constructErrorObject";
import Joi from "joi";
import serializeError from "../helpers/serializeError";

const checkResponseError = (err: unknown) => {
  const responseErrorSchema = Joi.object({
    message: Joi.string(),
    code: Joi.number(),
    error: Joi.any(),
  }).required();

  return <Promise<ResponseError>>responseErrorSchema.validateAsync(err);
};

const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  try {
    const responseError = await checkResponseError(err);

    const { code, message, error } = constructErrorObject(responseError);

    const response = {
      data: null,
      error: {
        message: message,
        errorDetails: error,
      },
    };

    res.status(code).json(response);
  } catch {
    const error = serializeError(<unknown>err);

    next(error);
  }
};

export default errorHandler;
