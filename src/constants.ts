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
}