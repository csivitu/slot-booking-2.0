import { Router } from "express";
import adminController from "../../contollers/adminController";
import appController from "../../contollers/appController";
import {
  adminBookSlotSchema,
  adminCancelSlotSchema,
} from "../../helpers/validationSchemas";
import handleValidation from "../../middlewares/handleValidation";
import requireAdmin from "../../middlewares/requireAdmin";
import requireUser from "../../middlewares/requireUser";
import RequestProperties from "../../types/requestProperties";

const router = Router();

router.use(requireUser);

// router.post(
//   "/scan/:username",
//   handleValidation(adminCancelSlotSchema, RequestProperties.PARAMS),
//   adminController.scanQR
// );

router.use(requireAdmin);

router.get("/slots", appController.getSlots);
router.post(
  "/slots",
  handleValidation(adminBookSlotSchema, RequestProperties.BODY),
  adminController.bookSlot
);
router.post(
  "/changeSlot",
  handleValidation(adminBookSlotSchema, RequestProperties.BODY),
  adminController.changeSlot
);
router.post(
  "/cancelSlot",
  handleValidation(adminCancelSlotSchema, RequestProperties.BODY),
  adminController.cancelSlot
);
router.get(
  "/userInfo/:username",
  handleValidation(adminCancelSlotSchema, RequestProperties.PARAMS),
  adminController.getUserInfo
);
router.get("/users", adminController.getUsers);

export default router;
