import mongoose from "mongoose";

import { config } from "../../config";

// Close the Mongoose default connection is the event of application termination
process.on("SIGINT", () => {
  mongoose.connection.close().then(
    () => {
      process.exit(0);
    },
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
});

// Your Mongoose setup goes here
export default async () => {
  return mongoose.connect(config.mongoDB.uri);
};
