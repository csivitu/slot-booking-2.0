import { prop, Ref } from "@typegoose/typegoose";
import { ScopeTypes } from "../types/accountsUserType";
import { Slot } from "./slot";

export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, index: true, unique: true })
  public email!: string;

  @prop({ default: false })
  public isPaid!: boolean;

  @prop({ default: false })
  public isChangedSlot!: boolean;

  @prop({ ref: () => Slot, default: null })
  public slotBooked!: Ref<Slot> | null;

  @prop({
    required: true,
    type: () => [String],
    default: [ScopeTypes.USER],
  })
  public scope!: string[];
}
