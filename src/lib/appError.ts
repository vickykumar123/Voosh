import {ErrorType} from "../types/customType";

export const appError = (statusCode: number, message: string) => {
  const error = new Error() as ErrorType;
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
