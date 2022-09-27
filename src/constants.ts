export const customErrors = {
  notAuthorized: (suffix: string) => ({
    code: 403,
    message: `You are not authorized: ${suffix}`,
  }),
  notFound: (suffix: string) => ({
    code: 404,
    message: `Not found: ${suffix}`,
  }),
  badRequest: (suffix: string) => ({
    code: 400,
    message: `Bad request: ${suffix}`,
  }),
  conflict: (suffix: string) => ({
    code: 409,
    message: `Conflict: ${suffix}`,
  }),
  internalServerError: () => ({
    code: 500,
    message: `Internal server error`,
  }),
};

export const customErrorDescriptions = {
  noAuthorizationHeader: "No authorization header",
  invalidJWTToken: "Invalid JWT token",
  unableToDecodeJWT: "Unable to decode JWT correctly",
  unknownValidationError: "Unknown validation error occured",
  slotNotFound: "Slot not found",
  slotFull: "Slot is full",
  userNotFound: "User not found",
  slotAlreadyBooked: "Slot already booked",
  slotAlreadyChanged: "Slot already changed",
  slotNotBooked: "Slot not booked",
  slotAlreadyStarted: "Slot already started",
  cannotChangeWithin12Hours:
    "Cannot change slot within 12 hours of slot start time",
  notAdmin: "shorturl.at/aCQ14",
  alreadyScanned: "Already scanned",
};
