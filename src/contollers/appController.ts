import { getModelForClass } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { config } from "../config";
import { customErrors, customErrorDescriptions } from "../constants";
import { Slot, User } from "../entities";
import { generateQR } from "../helpers/generateQR";
import { bookingLog } from "../helpers/logger";
import { sendSlotBookedMail } from "../helpers/sendMail";
// import { generateSlotData } from "../helpers/SlotData";
import { getTime } from "../helpers/timeFormats";

const appController = {
  getSlots: <RequestHandler>(async (req, res, next) => {
    const slotModel = getModelForClass(Slot);
    const slots = await slotModel
      .find({})
      .sort({ date: 1, startTime: 1 })
      .populate("slotBookedBy", "name username");

    // const slots = await slotModel.create(generateSlotData());
    res.data = {
      slots,
    };
    next();
  }),
  bookSlot: <RequestHandler>(async (req, res, next) => {
    const { slotId } = <{ slotId: string }>req.body;
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel
      .findOne({ username: req.user.username })
      .populate("slotBooked", "startTime endTime");
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
    if (user.isScanned) {
      next({
        ...customErrors.conflict(customErrorDescriptions.alreadyScanned),
        error: new Error(customErrorDescriptions.alreadyScanned),
      });
      return;
    }

    if (
      user.slotBooked ||
      slot.slotBookedBy.includes(<Types.ObjectId>user._id)
    ) {
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
    const day = slot.day;
    if (day === 0) {
      if (slot.slotBookedBy.length >= config.slotCapacity.day1) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotFull),
          error: new Error(customErrorDescriptions.slotFull),
        });
        return;
      }
    } else if (day === 1) {
      if (slot.slotBookedBy.length >= config.slotCapacity.day2) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotFull),
          error: new Error(customErrorDescriptions.slotFull),
        });
        return;
      }
    } else if (day === 2) {
      if (slot.slotBookedBy.length >= config.slotCapacity.day3) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotFull),
          error: new Error(customErrorDescriptions.slotFull),
        });
        return;
      }
    }

    const qr = await generateQR(`${config.clientUrl}scan/${user.username}`);
    slot.slotBookedBy.push(user);
    user.slotBooked = slot;
    user.qrCode = qr ? qr : null;
    await Promise.all([slot.save(), user.save()]);
    await sendSlotBookedMail(
      {
        date: new Date(slot.startTime).toDateString(),
        time: `${getTime(slot.startTime.toString())} - ${getTime(
          slot.endTime.toString()
        )}`,
        svg: `${config.clientUrl}scan/${user.username}`,
      },
      user.email
    );
    bookingLog.info(
      `${user.username} booked slot ${(<Types.ObjectId>slot._id).toString()}`,
      user
    );
    res.data = {
      user,
    };
    next();
  }),
  changeSlot: <RequestHandler>(async (req, res, next) => {
    const { slotId } = <{ slotId: string }>req.body;
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel.findOne({ username: req.user.username });
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
    if (!user.slotBooked) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotNotBooked),
        error: new Error(customErrorDescriptions.slotNotBooked),
      });
      return;
    }
    if (user.isScanned) {
      next({
        ...customErrors.conflict(customErrorDescriptions.alreadyScanned),
        error: new Error(customErrorDescriptions.alreadyScanned),
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
    const day = slot.day;
    if (day === 0) {
      if (slot.slotBookedBy.length >= config.slotCapacity.day1) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotFull),
          error: new Error(customErrorDescriptions.slotFull),
        });
        return;
      }
    } else if (day === 1) {
      if (slot.slotBookedBy.length >= config.slotCapacity.day2) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotFull),
          error: new Error(customErrorDescriptions.slotFull),
        });
        return;
      }
    } else if (day === 2) {
      if (slot.slotBookedBy.length >= config.slotCapacity.day3) {
        next({
          ...customErrors.conflict(customErrorDescriptions.slotFull),
          error: new Error(customErrorDescriptions.slotFull),
        });
        return;
      }
    }
    if (slot.slotBookedBy.includes(<Types.ObjectId>user._id)) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyBooked),
        error: new Error(customErrorDescriptions.slotAlreadyBooked),
      });
      return;
    }
    //check if start time of slot is atleast 12 hours after current time

    const oldSlot = await slotModel.findById(user.slotBooked);
    if (!oldSlot) {
      next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
      return;
    }
    if (oldSlot.startTime.getTime() < new Date().getTime()) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyStarted),
        error: new Error(customErrorDescriptions.slotAlreadyStarted),
      });
      return;
    }

    oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
      (id) =>
        (<Types.ObjectId>id).toString() !==
        (<Types.ObjectId>user._id).toString()
    );
    slot.slotBookedBy.push(user);
    user.slotBooked = slot;
    user.isChangedSlot = true;
    await Promise.all([slot.save(), user.save(), oldSlot.save()]);
    bookingLog.info(
      `${user.username} changed slot from ${(<Types.ObjectId>(
        oldSlot._id
      )).toString()} to ${(<Types.ObjectId>slot._id).toString()}`,
      user
    );
    res.data = {
      user,
    };
    next();
  }),
  cancelSlot: <RequestHandler>(async (req, res, next) => {
    const slotModel = getModelForClass(Slot);
    const userModel = getModelForClass(User);
    const user = await userModel
      .findOne({ username: req.user.username })
      .populate("slotBooked", "startTime endTime");
    if (!user) {
      next({
        ...customErrors.notFound(customErrorDescriptions.userNotFound),
        error: new Error(customErrorDescriptions.userNotFound),
      });
      return;
    }
    if (user.isScanned) {
      next({
        ...customErrors.conflict(customErrorDescriptions.alreadyScanned),
        error: new Error(customErrorDescriptions.alreadyScanned),
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
    const slot = await slotModel.findById(user.slotBooked);
    if (!slot) {
      next({
        ...customErrors.notFound(customErrorDescriptions.slotNotFound),
        error: new Error(customErrorDescriptions.slotNotFound),
      });
      return;
    }
    if (slot.startTime.getTime() - Date.now() < 12 * 60 * 60 * 1000) {
      next({
        ...customErrors.conflict(customErrorDescriptions.slotAlreadyStarted),
        error: new Error(customErrorDescriptions.slotAlreadyStarted),
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
    slot.slotBookedBy = slot.slotBookedBy.filter(
      (id) =>
        (<Types.ObjectId>id).toString() !==
        (<Types.ObjectId>user._id).toString()
    );
    user.slotBooked = null;
    user.isChangedSlot = true;
    user.qrCode = null;
    await Promise.all([slot.save(), user.save()]);
    bookingLog.info(
      `${user.username} cancelled slot ${(<Types.ObjectId>(
        slot._id
      )).toString()}`,
      user
    );
    res.data = {
      user,
    };
    next();
  }),
  getUserInfo: <RequestHandler>(async (req, res, next) => {
    const userModel = getModelForClass(User);
    getModelForClass(Slot);
    const user = await userModel
      .findOne({ username: req.user.username })
      .populate("slotBooked", "startTime endTime");
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

  getBookingStats: <RequestHandler>(async (req, res, next) => {
    const userModel = getModelForClass(User);
    const slotModel = getModelForClass(Slot);
    const users = await userModel.find();
    const slots = await slotModel.find();
    const stats = {
      totalUsers: users.length,
      totalSlots: slots.length,
      totalBookedSlots: slots.filter((slot) => slot.slotBookedBy.length > 0)
        .length,
      totalBookedUsers: users.filter((user) => user.slotBooked).length,
      totalScannedUsers: users.filter((user) => user.isScanned).length,
      totalRemainingSeats: slots.reduce(
        (acc, slot) =>
          acc +
          (slot.day === 2 || slot.day === 3
            ? config.slotCapacity.day2
            : config.slotCapacity.day1) -
          slot.slotBookedBy.length,
        0
      ),
    };
    res.data = {
      stats,
    };
    next();
  }),
};

export default appController;
