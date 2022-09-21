import { Router } from "express";
import appController from "../../contollers/appController";
import { bookSlotSchema } from "../../helpers/validationSchemas";
import handleValidation from "../../middlewares/handleValidation";
import requireUser from "../../middlewares/requireUser";
import RequestProperties from "../../types/requestProperties";

const router = Router();

router.use(requireUser);

router.get("/slots", appController.getSlots);
router.post(
  "/slots",
  handleValidation(bookSlotSchema, RequestProperties.BODY),
  appController.bookSlot
);
router.post(
  "changeSlot",
  handleValidation(bookSlotSchema, RequestProperties.BODY),
  appController.changeSlot
);
router.post(
  "/cancelSlot",
  handleValidation(bookSlotSchema, RequestProperties.BODY),
  appController.cancelSlot
);
router.get("/userInfo", appController.getUserInfo);

export default router;
