import bootstrap from "./bootstrap";
import { config } from "./config";
import serializeError from "./helpers/serializeError";

bootstrap(config).catch((err) => {
  console.error(serializeError(<unknown>err));
  process.exit(1);
});
