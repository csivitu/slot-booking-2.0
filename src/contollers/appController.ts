import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { config } from "../config";
import { customErrors, customErrorDescriptions } from "../constants";
import { Slot, User } from "../entities";

const appController = {
  getSlots: <RequestHandler>(async (req, res, next) => {
    const slotModel = getModelForClass(Slot);
    const slots = await slotModel
      .find({})
      .sort({ date: 1, startTime: 1 })
      .populate("slotBookedBy", "name");
    res.data = {
      slots,
    };
    next();
  }),
  bookSlot: <RequestHandler>(async (req, res, next) => {
    const { slotId } = <{ slotId: string }>req.body;
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
      return;
    }
    const slot = await slotModel.findById(slotId);
    if (!slot) {
      next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
      return;
    }
    if (slot.slotBookedBy.length >= config.slotCapacity) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotFull),
        error: new Error(customErrorDescriptions.slotFull),
      });
      return;
    }
    if (slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyBooked),
        error: new Error(customErrorDescriptions.slotAlreadyBooked),
      });
      return;
    }
    // check if slot time is after current time
    if (slot.startTime.getTime() < new Date().getTime()) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyStarted),
        error: new Error(customErrorDescriptions.slotAlreadyStarted),
      });
      return;
    }

    slot.slotBookedBy.push(user);
    user.slotBooked = slot;
    await Promise.all([slot.save(), user.save()]);
    res.data = {
      slot,
    };
    next();
  }),
  changeSlot: <RequestHandler>(async (req, res, next) => {
    const { slotId } = <{ slotId: string }>req.body;
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("slotBooked");
    if (!user) {
      next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
      return;
    }
    const slot = await slotModel.findById(slotId);
    if (!slot) {
      next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
      return;
    }
    if (slot.slotBookedBy.length >= config.slotCapacity) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotFull),
        error: new Error(customErrorDescriptions.slotFull),
      });
      return;
    }
    if (slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyBooked),
        error: new Error(customErrorDescriptions.slotAlreadyBooked),
      });
      return;
    }
    if (!user.slotBooked) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotNotBooked),
        error: new Error(customErrorDescriptions.slotNotBooked),
      });
      return;
    }
    if (user.isChangedSlot) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyChanged),
        error: new Error(customErrorDescriptions.slotAlreadyChanged),
      });
      return;
    }
    //check if start time of slot is atleast 12 hours after current time
    if (
      (<Slot>user.slotBooked).startTime.getTime() - Date.now() <
      12 * 60 * 60 * 1000
    ) {
      next({
        ...customErrors.conflict(
          customErrorDescriptions.cannotChangeWithin12Hours
        ),
        error: new Error(customErrorDescriptions.cannotChangeWithin12Hours),
      });
      return;
    }

    const oldSlot = await slotModel.findById(user.slotBooked);
    if (!oldSlot) {
      next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
      return;
    }

    oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter((id) => id !== user._id);
    slot.slotBookedBy.push(user);
    user.slotBooked = slot;
    user.isChangedSlot = true;
    await Promise.all([slot.save(), user.save(), oldSlot.save()]);
    res.data = {
      slot,
    };
    next();
  }),
  cancelSlot: <RequestHandler>(async (req, res, next) => {
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
      return;
    }
    const slotModel = getModelForClass(Slot);
    const slot = await slotModel.findById(user.slotBooked);
    if (!slot) {
      next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
      return;
    }
    if (slot.startTime < new Date()) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyStarted),
        error: new Error(customErrorDescriptions.slotAlreadyStarted),
      });
      return;
    }
    slot.slotBookedBy = slot.slotBookedBy.filter((id) => id !== user._id);
    user.slotBooked = null;
    await Promise.all([slot.save(), user.save()]);
    res.data = {
      slot,
    };
    next();
  }),
  getUserInfo: <RequestHandler>(async (req, res, next) => {
    const userModel = getModelForClass(User);
    getModelForClass(Slot);
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("slotBooked", "date startTime endTime");
    if (!user) {
      next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
      return;
    }
    res.data = {
      user,
    };
    next();
  }),
};

export default appController;
