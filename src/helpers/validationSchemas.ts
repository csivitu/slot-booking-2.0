import Joi from "joi";
import { ScopeTypes } from "../types/accountsUserType";

export const authorizationHeaderSchema = Joi.object({
  authorization: Joi.string().required(),
})
  .required()
  .unknown(true);

export const bookSlotSchema = Joi.object({
  slotId: Joi.string().required(),
}).required();

export const adminBookSlotSchema = Joi.object({
  slotId: Joi.string().required(),
  email: Joi.string().email().required(),
}).required();

export const adminCancelSlotSchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const payloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  scopes: Joi.array()
    .items(Joi.string().valid(...Object.values(ScopeTypes)))
    .required(),
}).required();
