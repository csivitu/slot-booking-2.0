import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { config } from "../config";
import { customErrorDescriptions, customErrors } from "../constants";
import { Slot, User } from "../entities";

interface AdminControllerSchema {
  bookSlot: RequestHandler;
  changeSlot: RequestHandler;
  cancelSlot: RequestHandler;
  getUserInfo: RequestHandler;
  getUsers: RequestHandler;
}

const adminController: AdminControllerSchema = {
  bookSlot: async (req, res, next) => {
    const { slotId, email } = req.body as { slotId: string; email: string };
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email });
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
    slot.slotBookedBy.push(user._id);
    await slot.save();
    res.data = {
      slot,
      user,
    };
    return next();
  },
  changeSlot: async (req, res, next) => {
    const { slotId, email } = req.body as {
      slotId: string;
      email: string;
    };
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email });
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
    slot.slotBookedBy.push(user._id);
    await slot.save();
    res.data = {
        slot,
        user,
    };
    return next();

  },
    cancelSlot: async (req, res, next) => {
        const { slotId, email } = req.body as { slotId: string; email: string };
        const slotModel = getModelForClass(Slot);
        const userModel = getModelForClass(User);
        const user = await userModel.findOne({ email });
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
        if (!slot.slotBookedBy.includes(user._id)) {
            return next({
                ...customErrors.conflict(customErrorDescriptions.userNotFound),
                error: new Error(customErrorDescriptions.userNotFound),
            });
        }
        if(!user.slotBooked === slot._id){
            return next({
                ...customErrors.conflict(customErrorDescriptions.slotNotFound),
                error: new Error(customErrorDescriptions.slotNotFound),
            });
        }
        // check if slot time is after current time
        if (slot.startTime.getTime() < new Date().getTime()) {
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
            user,
        };
        return next();
    },
    getUserInfo: async (req, res, next) => {
        const { email } = req.body as { email: string };
        const userModel = getModelForClass(User);
        const user = await userModel.findOne({ email });
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
    getUsers: async (req, res, next) => {
        const { email } = req.body as { email: string };
        const userModel = getModelForClass(User);
        const user = await userModel.findOne({ email }).populate("slotBooked");
        if (!user) {
            return next({
                ...customErrors.notFound(customErrorDescriptions.userNotFound),
                error: new Error(customErrorDescriptions.userNotFound),
            });
        }
        res.data = {
            user,
        }
        return next();
    }
};

export default adminController;
