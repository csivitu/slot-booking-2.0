import express from "express";

import loaders from "./loaders";
import { Config } from "../config";
import { logger } from "../helpers/logger";

export default async (config: Config) => {
  const app = await loaders(express());

  app.listen({ port: config.port }, () => {
    logger.warn(`🚀 Server ready at http://localhost:${config.port}`);
  });
};
