import * as _ from 'lodash';
import { ResponseOptions } from '../common/types';

export const HTTP_CODE = {
  Success: 200,
  Created: 201,
  BadRequest: 400,
  UnAuthorize: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  ServerInternalError: 500
};
export class HttpResponseUtil {
  static ok(data: any, status: number = null, options: ResponseOptions = {}) {
    return _.merge(
      {
        status: status || HTTP_CODE.Success,
        body: {
          success: true,
          data
        },
        headers: {
          'content-type': 'application/json'
        }
      },
      options
    );
  }

  static failed(message: string = '', status: number = null, details: Array<any> = []) {
    return {
      status: status || HTTP_CODE.ServerInternalError,
      body: {
        success: false,
        message,
        details
      },
      headers: {
        'content-type': 'application/json'
      }
    };
  }
}
