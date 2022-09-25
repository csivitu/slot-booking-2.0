import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { config } from "../config";
import { customErrorDescriptions, customErrors } from "../constants";
import { Slot, User } from "../entities";

const adminController = {
  bookSlot: <RequestHandler>(async (req, res, next) => {
    try {
      const { slotId, email } = <{ slotId: string; email: string }>req.body;
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
      if (slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
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
        user,
      };
      next();
    } catch (err) {
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  changeSlot: <RequestHandler>(async (req, res, next) => {
    try {
      const { slotId, email } = <
        {
          slotId: string;
          email: string;
        }
      >req.body;
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
      if (slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
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
        user,
      };
      next();
    } catch (err) {
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  cancelSlot: <RequestHandler>(async (req, res, next) => {
    try {
      const { slotId, email } = <{ slotId: string; email: string }>req.body;
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
      if (!slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
        return next({
          ...customErrors.conflict(customErrorDescriptions.userNotFound),
          error: new Error(customErrorDescriptions.userNotFound),
        });
      }
      if (user.slotBooked !== <Types.ObjectId>slot._id) {
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
      slot.slotBookedBy = slot.slotBookedBy.filter(
        (id) => id !== <Types.ObjectId>user._id
      );
      user.slotBooked = null;
      await Promise.all([slot.save(), user.save()]);
      res.data = {
        slot,
        user,
      };
      next();
    } catch (err) {
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  getUserInfo: <RequestHandler>(async (req, res, next) => {
    try {
      const { email } = <{ email: string }>req.body;
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
      next();
    } catch (err) {
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  getUsers: <RequestHandler>(async (req, res, next) => {
    try {
      const userModel = getModelForClass(User);
      const users = await userModel.find().populate("slotBooked");
      res.data = {
        users,
      };
      next();
    } catch (err) {
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
};

export default adminController;