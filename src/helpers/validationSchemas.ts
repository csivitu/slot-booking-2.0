import Joi from "joi";
import { ScopeTypes } from "../types/accountsUserType";

export const authorizationHeaderSchema = Joi.object({
  authorization: Joi.string().required(),
})
  .required()
  .unknown(true);

export const bookSlotSchema = Joi.object({
  slotId: Joi.string().hex().length(24).message("invalid object id").required(),
}).required();

export const adminBookSlotSchema = Joi.object({
  slotId: Joi.string().hex().length(24).message("invalid object id").required(),
  username: Joi.string().min(3).max(20).required(),
}).required();

export const adminCancelSlotSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
}).required();

export const payloadSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  scope: Joi.array()
    .items(Joi.string().valid(...Object.values(ScopeTypes)))
    .required(),
}).required();
