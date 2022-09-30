import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { config } from "../config";
import { customErrorDescriptions, customErrors } from "../constants";
import { Slot, User } from "../entities";
import { generateQR } from "../helpers/generateQR";
import { adminLogger, errorLog } from "../helpers/logger";
import serializeError from "../helpers/serializeError";

const adminController = {
  bookSlot: <RequestHandler>(async (req, res, next) => {
    try {
      const { slotId, username } = <{ slotId: string; username: string }>(
        req.body
      );
      const slotModel = getModelForClass(Slot);
      const userModel = getModelForClass(User);
      const user = await userModel.findOne({ username });
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

      const qr = await generateQR(`${config.clientUrl}scan/${user.username}`);
      slot.slotBookedBy.push(user);
      user.qrCode = qr ? qr : null;
      user.slotBooked = slot;
      await Promise.all([slot.save(), user.save()]);
      adminLogger.info(
        `Slot ${slotId} booked for ${username} by ${req.user.username}`
      );
      res.data = {
        slot,
        user,
      };
      next();
    } catch (err) {
      errorLog.error(serializeError(err));
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  changeSlot: <RequestHandler>(async (req, res, next) => {
    try {
      const { slotId, username } = <
        {
          slotId: string;
          username: string;
        }
      >req.body;
      const slotModel = getModelForClass(Slot);
      const userModel = getModelForClass(User);
      const user = await userModel.findOne({ username });
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
      if (!user.slotBooked) {
        return next({
          ...customErrors.notFound(customErrorDescriptions.slotNotBooked),
          error: new Error(customErrorDescriptions.slotNotBooked),
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
      const oldSlot = await slotModel.findById(user.slotBooked);
      if (!oldSlot) {
        return next({
          ...customErrors.notFound(customErrorDescriptions.slotNotFound),
          error: new Error(customErrorDescriptions.slotNotFound),
        });
      }
      oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
        (id) =>
          (<Types.ObjectId>id).toString() !==
          (<Types.ObjectId>user._id).toString()
      );
      slot.slotBookedBy.push(user);
      user.slotBooked = slot;
      await Promise.all([slot.save(), user.save()]);
      adminLogger.info(
        `Slot ${(<Types.ObjectId>(
          oldSlot._id
        )).toString()} changed to ${slotId} for ${username} by ${
          req.user.username
        }`
      );
      res.data = {
        slot,
        user,
      };
      next();
    } catch (err) {
      errorLog.error(serializeError(err));
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  cancelSlot: <RequestHandler>(async (req, res, next) => {
    try {
      const { username } = <{ username: string }>req.body;
      const slotModel = getModelForClass(Slot);
      const userModel = getModelForClass(User);
      const user = await userModel.findOne({ username });
      if (!user) {
        return next({
          ...customErrors.notFound(customErrorDescriptions.userNotFound),
          error: new Error(customErrorDescriptions.userNotFound),
        });
      }
      if (!user.slotBooked) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotNotBooked),
          error: new Error(customErrorDescriptions.slotNotBooked),
        });
        return;
      }
      const slot = await slotModel.findById(user.slotBooked);
      if (!slot) {
        return next({
          ...customErrors.notFound(customErrorDescriptions.slotNotFound),
          error: new Error(customErrorDescriptions.slotNotFound),
        });
      }
      if (!slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
        user.slotBooked = null;
        await user.save();
        return next({
          ...customErrors.conflict(customErrorDescriptions.userNotFound),
          error: new Error(customErrorDescriptions.userNotFound),
        });
      }
      // check if slot time is after current time

      slot.slotBookedBy = slot.slotBookedBy.filter(
        (id) =>
          (<Types.ObjectId>id).toString() !==
          (<Types.ObjectId>user._id).toString()
      );
      user.slotBooked = null;
      user.isScanned = false;
      await Promise.all([slot.save(), user.save()]);
      adminLogger.info(
        `Slot ${(<Types.ObjectId>(
          slot._id
        )).toString()} cancelled for ${username} by ${req.user.username}`
      );
      res.data = {
        slot,
        user,
      };
      next();
    } catch (err) {
      errorLog.error(serializeError(err));
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  getUserInfo: <RequestHandler>(async (req, res, next) => {
    try {
      const { username } = <{ username: string }>req.params;
      const userModel = getModelForClass(User);
      const user = await userModel.findOne({ username });
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
      errorLog.error(serializeError(err));
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
  scanQR: <RequestHandler>(async (req, res, next) => {
    try {
      if (!req.user.scope.includes("admin")) {
        return next({
          ...customErrors.notAuthorized(customErrorDescriptions.notAdmin),
          error: new Error(customErrorDescriptions.notAdmin),
        });
      }
      const { username } = <{ username: string }>req.params;
      const userModel = getModelForClass(User);
      getModelForClass(Slot);
      const user = await userModel
        .findOne({ username })
        .populate("slotBooked", "startTime endTime");
      if (!user) {
        return next({
          ...customErrors.notFound(customErrorDescriptions.userNotFound),
          error: new Error(customErrorDescriptions.userNotFound),
        });
      }
      if (user.isScanned) {
        return next({
          ...customErrors.conflict(customErrorDescriptions.alreadyScanned),
          error: new Error(customErrorDescriptions.alreadyScanned),
        });
      }
      if (!user.slotBooked) {
        return next({
          ...customErrors.conflict(customErrorDescriptions.slotNotBooked),
          error: new Error(customErrorDescriptions.slotNotBooked),
        });
      }
      user.isScanned = true;
      await user.save();
      adminLogger.info(`QR scanned for ${username} by ${req.user.username}`);
      res.data = {
        user,
      };
      next();
    } catch (err) {
      errorLog.error(serializeError(err));
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),

  getUsers: <RequestHandler>(async (req, res, next) => {
    try {
      const userModel = getModelForClass(User);
      const users = await userModel
        .find()
        .populate("slotBooked", "startTime endTime");
      res.data = {
        users,
      };
      next();
    } catch (err) {
      errorLog.error(serializeError(err));
      return next({ ...customErrors.internalServerError(), error: err });
    }
  }),
};

export default adminController;
