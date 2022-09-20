import { Router } from "express";
import appRouter from "./appRouter";
const router = Router();

router.use(
  "/app",
  appRouter
);

export default router;