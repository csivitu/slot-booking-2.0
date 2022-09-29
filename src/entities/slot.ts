import { prop, Ref } from "@typegoose/typegoose";
import { User } from "./user";

export class Slot {
  @prop({ required: true })
  public startTime!: Date;

  @prop({ required: true })
  public endTime!: Date;

  @prop({ default: 0 })
  public day!: number;

  @prop({ required: true, ref: () => User, default: [] })
  public slotBookedBy!: Ref<User>[];
}
