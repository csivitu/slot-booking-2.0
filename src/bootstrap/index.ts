import express from "express";

import loaders from "./loaders";
import { Config } from "../config";

export default async (config: Config) => {
  const app = await loaders(express());

  app.listen({ port: config.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}`);
  });
};
