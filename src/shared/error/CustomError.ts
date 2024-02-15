import { STATUSCODE } from "../../utils/enums/statusCode";

export class CustomError extends Error {
  constructor(message: string, public code: STATUSCODE) {
    super(message);
    this.name = this.constructor.name;
  }
}

