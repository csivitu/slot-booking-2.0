import Joi from "joi";

export const authorizationHeaderSchema = Joi.object({
  authorization: Joi.string().required(),
})
  .required()
  .unknown(true);

export const bookSlotSchema = Joi.object({
    slotId: Joi.string().required(),
}).required();