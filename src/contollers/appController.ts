import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { config } from "../config";
import { customErrors, customErrorDescriptions } from "../constants";
import { Slot, User } from "../entities";

interface AppControllerSchema {
  getSlots: RequestHandler;
  bookSlot: RequestHandler;
  changeSlot: RequestHandler;
  cancelSlot: RequestHandler;
  getUserInfo: RequestHandler;
}

const appController: AppControllerSchema = {
  getSlots: async (req, res, next) => {
    const slotModel = getModelForClass(Slot);
    const slots = await slotModel.find({}).sort({ date: 1, startTime: 1 }).populate("slotBookedBy", "name");
    res.data = {
      slots,
    };
    return next();
  },
  bookSlot: async (req, res, next) => {
    const { slotId } = req.body as { slotId: string };
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
        return next({
            ...customErrors.notFound(customErrorDescriptions.userNotFound),
            error: new Error(customErrorDescriptions.userNotFound),
        });
    }
    const slot = await slotModel.findById(slotId);
    if (!slot) {
        return next({
            ...customErrors.notFound(customErrorDescriptions.slotNotFound),
            error: new Error(customErrorDescriptions.slotNotFound),
        });
    }
    if (slot.slotBookedBy.length >= config.slotCapacity) {
        return next({
            ...customErrors.conflict(customErrorDescriptions.slotFull),
            error: new Error(customErrorDescriptions.slotFull),
        });
    }
    if (slot.slotBookedBy.includes(user._id)) {
        return next({
            ...customErrors.conflict(customErrorDescriptions.slotAlreadyBooked),
            error: new Error(customErrorDescriptions.slotAlreadyBooked),
        });
    }
    slot.slotBookedBy.push(user);
    user.slot = slot;
    await Promise.all([slot.save(), user.save()]);
    res.data = {
        slot,
    };
    return next();
  },
  changeSlot: async (req, res, next) => {
    return next();
  },
  cancelSlot: async (req, res, next) => {
    return next();
  },
  getUserInfo: async (req, res, next) => {
    return next();
  },
};

export default appController;
