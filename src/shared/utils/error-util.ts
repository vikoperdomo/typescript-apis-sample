import { ERROR_MESSAGE } from '../common/constants';
import { HTTP_CODE } from './http-response';

export declare class Error {
  public name: string;
  public message: string;
  public stack: string;
  public statusCode: number;
  public code: string;
  constructor(message?: string);
}

export class AppError extends Error {
  constructor(message: string = ERROR_MESSAGE.ErrorOccurred, statusCode: number = HTTP_CODE.ServerInternalError) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_CODE.BadRequest;
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_CODE.UnAuthorize;
  }
}
