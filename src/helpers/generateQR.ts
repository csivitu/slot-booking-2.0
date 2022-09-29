import QRCode, { QRCodeToStringOptions } from "qrcode";
import { errorLog } from "./logger";
import serializeError from "./serializeError";

export const generateQR = async (text: string) => {
  try {
    const opts: QRCodeToStringOptions = {
      type: "svg",
    };

    return await QRCode.toString(text, opts);
  } catch (err) {
    errorLog.error(serializeError(err));
  }
};
