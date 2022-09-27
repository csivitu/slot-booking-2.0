import QRCode, { QRCodeToStringOptions } from "qrcode";

export const generateQR = async (text: string) => {
  try {
    const opts: QRCodeToStringOptions = {
      type: "svg",
    };

    console.log(await QRCode.toString(text, opts));
  } catch (err) {
    console.error(err);
  }
};
