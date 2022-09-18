import bootstrap from "./bootstrap";
import { config } from "./config";

bootstrap(config).catch((err) => {
  console.error(err);
  process.exit(1);
});