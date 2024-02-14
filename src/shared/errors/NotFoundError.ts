import { CustomError } from "./CustomError";
import { StatusCode } from "../../utils/enums/statusCode";

export class NotFoundError extends CustomError {
  constructor(entity: string) {
    super(`${entity} not found.`, StatusCode.NOT_FOUND);
  }
}
