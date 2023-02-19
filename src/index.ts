import bootstrap from "./bootstrap";
import { config } from "./config";
import { errorLog } from "./helpers/logger";
import serializeError from "./helpers/serializeError";

bootstrap(config).catch((err) => {
  errorLog.error(serializeError(<unknown>err));
  process.exit(1);
});
