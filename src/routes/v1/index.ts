import { Router } from "express";
import limiter from "../../helpers/rateLimiter";
import { authorizationHeaderSchema } from "../../helpers/validationSchemas";
import authMiddleware from "../../middlewares/authMiddleware";
import handleValidation from "../../middlewares/handleValidation";
import RequestProperties from "../../types/requestProperties";
import adminRouter from "./adminRouter";
import appRouter from "./appRouter";
const router = Router();

router.use(authMiddleware);
router.use(
  handleValidation(authorizationHeaderSchema, RequestProperties.HEADERS)
);
router.use("/app", limiter, appRouter);
router.use("/admin", adminRouter);
export default router;
