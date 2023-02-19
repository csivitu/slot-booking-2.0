import { RequestHandler } from "express";

const responseHandler: RequestHandler = (req, res, next) => {
  if (res.data) {
    const response = {
      data: res.data,
      error: null,
    };

    res.json(response);

    return;
  }

  next();
};

export default responseHandler;
