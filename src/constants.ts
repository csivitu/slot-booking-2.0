export const customErrors = {
  notAuthorized: (suffix: string) => ({
    code: 403,
    message: `You are not authorized: ${suffix}`,
  }),
  notFound: (suffix: string) => ({
    code: 404,
    message: `Not found: ${suffix}`,
  }),
};

export const customErrorDescriptions = {
    noAuthorizationHeader: "No authorization header",
    invalidJWTToken: "Invalid JWT token",
}