const serializeError = <T>(err: T) => {
  if (typeof err === "object" && err !== null) {
    if (Array.isArray(err)) {
      const error = <T>err.map((e) => serializeError(<unknown>e));

      return error;
    }

    const error = <T>{};
    const allKeys = Object.getOwnPropertyNames(err);

    allKeys.forEach((key) => {
      error[key as keyof T] = serializeError(err[key as keyof T]);
    });

    return error;
  }

  return err;
};

export default serializeError;
