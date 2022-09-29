import { createLogger, transports } from "winston";

export const logger = createLogger({
  transports: [
    // new LoggingWinston(gcpAuthObject), // TO-DO: uncomment this line
    new transports.Console(),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});
export const errorLog = createLogger({
  transports: [
    // new LoggingWinston(gcpAuthObject), // TO-DO: uncomment this line
    new transports.Console(),
    new transports.File({ filename: "logs/error.log" }),
  ],
});
export const bookingLog = createLogger({
  transports: [
    // new LoggingWinston(gcpAuthObject), // TO-DO: uncomment this line
    new transports.Console(),
    new transports.File({ filename: "logs/booking.log" }),
  ],
});

export const adminLogger = createLogger({
  transports: [
    // new LoggingWinston(gcpAuthObject), // TO-DO: uncomment this line
    new transports.Console(),
    new transports.File({ filename: "logs/admin.log" }),
  ],
});
