import { prop, Ref } from "@typegoose/typegoose";
import { Slot } from "./slot";


export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, index: true, unique: true })
  public email!: string; 

  @prop({ default: false })
  public isPaid!: boolean; 

  @prop({ required: false, ref: () => Slot })
  public slot!: Ref<Slot>;
}