const serializeError = <T>(err: T) => {
    if (typeof err === "object" && err !== null) {
      if (Array.isArray(err)) {
        const error = err.map((e) =>
          serializeError(e as unknown)
        ) as unknown as T;
  
        return error;
      }
  
      const error = {} as T;
      const allKeys = Object.getOwnPropertyNames(err);
  
      allKeys.forEach((key) => {
        error[key as keyof T] = serializeError(err[key as keyof T]);
      });
  
      return error;
    }
  
    return err;
  };
  
  export default serializeError;
  