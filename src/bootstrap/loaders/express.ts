import express from "express";
import cors from "cors";
// import helmet from "helmet";
import cookieParser from "cookie-parser";
import v1 from "../../routes/v1";

export default (app: express.Application) => {
  // Body parser only needed during POST on the graphQL path
  app.use(express.json());

  // Cors configuration
  app.use(cors());

  //cookie parser
  app.use(cookieParser());

  app.use("/v1", v1);

  // Sets various HTTP headers to help protect our app
//   if (process.env.NODE_ENV === "production") app.use(helmet());
};
