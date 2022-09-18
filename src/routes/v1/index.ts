import { Router } from "express";
import appRouter from "./appRouter";
import authRouter from "./authRouter";

const router = Router();

router.use("/auth", authRouter);

router.use(
  "/app",
  appRouter
);

export default router;