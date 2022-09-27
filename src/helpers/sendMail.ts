import path from "path";
import ejs from "ejs";
import { HtmlDataType } from "../types/htmlDataType";
import { config } from "../config";
import https from "https";

export const sendSlotBookedMail = async (data: HtmlDataType, email: string) => {
  console.log("hi");
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "..", "..", "views/booked-slot.ejs"),
      data
    );
    const mailData = {
      to: email,
      text: "Slot Booked",
      subject: "Book slot",
      html,
      auth: config.emailer.auth,
    };
    const postOptions = {
      host: config.emailer.host,
      port: "443",
      path: config.emailer.path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify(mailData)),
      },
    };

    // Set up the request
    const postReq = https.request(postOptions, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        console.log("Response: ", chunk);
      });
    });

    // post the data
    postReq.write(JSON.stringify(mailData));
    postReq.end();
  } catch (err) {
    console.log(err);
  }
};
