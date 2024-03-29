import { User } from "../../src/entities";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }

    interface Response {
      data: unknown;
    }
  }
}
