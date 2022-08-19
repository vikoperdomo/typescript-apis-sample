import fetch from 'node-fetch';
import { RequestOptions } from '../common/types';
import { AppError } from './error-util';
import * as _ from 'lodash';
import { HTTP_CODE } from './http-response';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

export class RequestUtil {
  /**
   * Get
   * @param {string} uri
   * @returns
   */
  static get(uri: string | URL, options: RequestOptions = {}) {
    options = _.merge({ method: 'GET' }, options);
    return fetch(uri, options).then(async (res) => await this.handleFetchResponse(res));
  }

  /**
   * Post
   * @param {String} uri
   * @param {object} data body request
   * @param {object} options
   * @returns {Promise<APIResponse>}
   */
  static post(uri: string | URL, data: object, options: RequestOptions = {}) {
    options = _.merge({ method: 'POST', body: JSON.stringify(data), headers: defaultHeaders }, options);
    return fetch(uri, options as object).then(async (res) => await this.handleFetchResponse(res));
  }

  /**
   * PUT
   * @param {String} uri
   * @param {object} data body request
   * @param {object} options
   * @returns {Promise<APIResponse>}
   */
  static put(uri: string, data: object, options: RequestOptions = {}) {
    options = _.merge({ method: 'PUT', body: JSON.stringify(data), header: defaultHeaders }, options);

    return fetch(uri, options as object).then(async (res) => await this.handleFetchResponse(res));
  }

  /**
   * Handle Fetch response data
   * @param {any} res Response data
   * @returns {}
   */
  static async handleFetchResponse(res: any) {
    if (res.ok) {
      return Promise.resolve(await res.json());
    }

    try {
      const response = await res.clone().json();
      // Handle error for Playfab cloud script execute function
      if (response.code && response.errorMessage && response.code !== HTTP_CODE.Success) {
        return Promise.reject(new AppError(response.errorMessage, response.code));
      }

      return Promise.resolve(response);
    } catch {
      const textMessage = await res.text();
      return Promise.reject(new AppError(textMessage || res.statusText, res.status));
    }
  }
}
