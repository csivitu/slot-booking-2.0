import { ResponseError } from "../types/errorTypes";
import serializeError from "./serializeError";

// TO-DO: If errorDetails is a typeorm error, set code and message accordingly
const constructErrorObject = (err: ResponseError) => {
  const {
    errorDetails,
    code = 500,
    message = "UnknownError: An unknown error occured",
  } = err;

  if (errorDetails) {
    const error = serializeError(errorDetails);

    // if (process.env.NODE_ENV !== "production") // TO-DO: uncomment this line
    return { code, message, errorDetails: error };
  }

  return { code, message, errorDetails: null };
};

export default constructErrorObject;
