import { Router } from "express";
import { authorizationHeaderSchema } from "../../helpers/validationSchemas";
import authMiddleware from "../../middlewares/authMiddleware";
import handleValidation from "../../middlewares/handleValidation";
import RequestProperties from "../../types/requestProperties";
import appRouter from "./appRouter";
const router = Router();
router.use(authMiddleware)
router.use(handleValidation(authorizationHeaderSchema, RequestProperties.HEADERS))
router.use(
  "/app",
  appRouter
);

export default router;