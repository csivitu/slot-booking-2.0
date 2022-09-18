import express from "express";

// loaders
import expressLoader from "./express";
import mongooseLoader from "./mongoose";

export default async (app: express.Application): Promise<express.Application> => {
  // Load everything related to express
  expressLoader(app);

  // Connect to mongoose
  await mongooseLoader();

  // load apollo server config
  return app;
};
