import mongoose from "mongoose";

import { config } from "../../config";
import serializeError from "../../helpers/serializeError";

// Close the Mongoose default connection is the event of application termination
process.on("SIGINT", () => {
  mongoose.connection.close().then(
    () => {
      process.exit(0);
    },
    (err) => {
      console.error(serializeError(<unknown>err));
      process.exit(1);
    }
  );
});

// Your Mongoose setup goes here
export default async () => {
  return mongoose.connect(config.mongoDB.uri);
};
