import dotenv from "dotenv";
dotenv.config();

// Safely get the environment variable in the process
const env = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};

export interface Config {
  port: number;
  isDev: boolean;
  mongoDB: {
    uri: string;
  };
  jwt: {
    secret: string;
  };
  slotCapacity: number;
  emailer: {
    host: string;
    auth: string;
    path: string;
  };
  clientUrl: string;
}

// All your secrets, keys go here
export const config: Config = {
  port: +env("PORT"),
  isDev: env("NODE_ENV") === "development",
  mongoDB: {
    uri: env("MONGODB_URI"),
  },
  jwt: {
    secret: env("JWT_SECRET"),
  },
  slotCapacity: 10,
  emailer: {
    host: env("EMAILER_HOST"),
    auth: env("EMAILER_AUTH"),
    path: env("EMAILER_PATH"),
  },
  clientUrl: env("CLIENT_URL"),
};
