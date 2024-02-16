import { STATUS_CODE } from "../../utils/enums/statusCode";

export class CustomError extends Error {
  constructor(message: string, public code: STATUS_CODE) {
    super(message);
    this.name = this.constructor.name;
  }
}

