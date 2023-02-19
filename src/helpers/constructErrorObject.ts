import { ResponseError } from "../types/errorTypes";
import serializeError from "./serializeError";

// TO-DO: If errorDetails is a typeorm error, set code and message accordingly
const constructErrorObject = (err: ResponseError) => {
  const {
    error,
    code = 500,
    message = "UnknownError: An unknown error occured",
  } = err;

  if (error) {
    // if (process.env.NODE_ENV !== "production") // TO-DO: uncomment this line
    return { code, message, error: serializeError(error) };
  }

  return { code, message, error: null };
};

export default constructErrorObject;
