import { CustomError } from "./CustomError";
import { StatusCode } from "../../utils/enums/statusCode";

export class InvalidIdError extends CustomError {
  constructor(id: string) {
    super(`Id ${id} is not valid.`, StatusCode.BAD_REQUEST);
  }
}
