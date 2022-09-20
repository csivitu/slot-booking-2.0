import { ErrorRequestHandler } from "express";
import { ResponseError } from "../types/errorTypes";
import constructErrorObject from "../helpers/constructErrorObject";
import Joi from "joi";
import serializeError from "../helpers/serializeError";

const checkResponseError = (err: unknown) => {
  const responseErrorSchema = Joi.object({
    message: Joi.string(),
    code: Joi.number(),
    errorDetails: Joi.any(),
  }).required();

  return responseErrorSchema.validateAsync(err) as Promise<ResponseError>;
};

const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  try {
    const responseError = await checkResponseError(err);

    const { code, message, errorDetails } = constructErrorObject(
      responseError
    );

    const response = {
      data: null,
      error: {
        message: message,
        errorDetails: errorDetails,
      },
    };

    res.status(code).json(response);
  } catch {
    const error = serializeError(err as unknown);

    next(error);
  }
};

export default errorHandler;
