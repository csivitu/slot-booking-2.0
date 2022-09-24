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
    const slots = await slotModel
      .find({})
      .sort({ date: 1, startTime: 1 })
      .populate("slotBookedBy", "name");
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
    // check if slot time is after current time
    if (slot.startTime.getTime() < new Date().getTime()) {
      return next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyStarted),
        error: new Error(customErrorDescriptions.slotAlreadyStarted),
      });
    }

    slot.slotBookedBy.push(user);
    user.slotBooked = slot;
    await Promise.all([slot.save(), user.save()]);
    res.data = {
      slot,
    };
    return next();
  },
  changeSlot: async (req, res, next) => {
    const { slotId } = req.body as { slotId: string };
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email: req.user.email }).populate("slotBooked");
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
    if (!user.slotBooked) {
      return next({
        ...customErrors.conflict(customErrorDescriptions.slotNotBooked),
        error: new Error(customErrorDescriptions.slotNotBooked),
      });
    }
    if (user.isChangedSlot) {
      return next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyChanged),
        error: new Error(customErrorDescriptions.slotAlreadyChanged),
      });
    }
    //check if start time of slot is atleast 12 hours after current time
    if ((user.slotBooked as Slot).startTime.getTime() - Date.now() < 12 * 60 * 60 * 1000) {
      return next({
        ...customErrors.conflict(customErrorDescriptions.cannotChangeWithin12Hours),
        error: new Error(customErrorDescriptions.cannotChangeWithin12Hours),
      });
    }


    const oldSlot = await slotModel.findById(user.slotBooked);
    if (!oldSlot) {
      return next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
    }

    oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter((id) => id !== user._id);
    slot.slotBookedBy.push(user);
    user.slotBooked = slot;
    user.isChangedSlot = true;
    await Promise.all([slot.save(), user.save(), oldSlot.save()]);
    res.data = {
      slot,
    };
    return next();
  },
  cancelSlot: async (req, res, next) => {
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
    }
    const slotModel = getModelForClass(Slot);
    const slot = await slotModel.findById(user.slotBooked);
    if (!slot) {
      return next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
    }
    if(slot.startTime < new Date()) {
      return next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyStarted),
        error: new Error(customErrorDescriptions.slotAlreadyStarted),
      });
    }
    slot.slotBookedBy = slot.slotBookedBy.filter((id) => id !== user._id);
    user.slotBooked = null;
    await Promise.all([slot.save(), user.save()]);
    res.data = {
      slot,
    };
    return next();
  },
  getUserInfo: async (req, res, next) => {
    const userModel = getModelForClass(User);
    getModelForClass(Slot);
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("slotBooked", "date startTime endTime");
    if (!user) {
      return next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
    }
    res.data = {
      user,
    };
    return next();
  },
};

export default appController;
