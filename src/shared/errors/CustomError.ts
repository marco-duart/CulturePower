import { StatusCode } from "../../utils/enums/statusCode";

export class CustomError extends Error {
  constructor(message: string, public code: StatusCode) {
    super(message);
    this.name = this.constructor.name;
  }
}

