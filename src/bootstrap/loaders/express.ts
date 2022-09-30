import express from "express";
import cors from "cors";
import helmet from "helmet";
import v1 from "../../routes/v1";
import errorHandler from "../../middlewares/errorHandler";
import responseHandler from "../../middlewares/responseHandler";
import { config } from "../../config";
import appController from "../../contollers/appController";

export default (app: express.Application) => {
  app.use(express.json());
  app.set("view engine", "ejs");

  // Cors configuration
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Sets various HTTP headers to help protect our app
  if (!config.isDev) {
    app.use(helmet());
  }

  app.get("/stats", appController.getBookingStats);
  app.use("/v1", v1);
  app.use(responseHandler);
  app.use(errorHandler);

  // Sets various HTTP headers to help protect our app
  //   if (process.env.NODE_ENV === "production") app.use(helmet());
};
