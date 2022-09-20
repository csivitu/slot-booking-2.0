import { AccountsUserType } from "../../src/types/accountsUserType";

declare global {
  namespace Express {
    interface Request {
      user?: AccountsUserType;
    }

    interface Response {
      data: unknown;
    }
  }
}
