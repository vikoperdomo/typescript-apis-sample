import * as Jwt from 'jsonwebtoken';
import { ERROR_MESSAGE } from '../common/constants';
import { AppError } from './error-util';

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

export class JwtUtil {
  /**
   * Create token
   * @param {object} data Jwt data body
   * @returns {string} The token
   */
  static createAccessToken(data) {
    if (!SECRET_KEY || !EXPIRES_IN) {
      throw new AppError(ERROR_MESSAGE.MissingAppCredentials);
    }

    return Jwt.sign(data, SECRET_KEY, { expiresIn: EXPIRES_IN });
  }

  /**
   * Create refresh token
   * @param {object} data Jwt data body
   * @returns {string} The token
   */
  static createRefreshToken(data) {
    if (!REFRESH_TOKEN_SECRET_KEY || !REFRESH_TOKEN_EXPIRES_IN) {
      throw new AppError(ERROR_MESSAGE.MissingAppCredentials);
    }

    return Jwt.sign(data, REFRESH_TOKEN_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }

  /**
   * Verify access token
   * @param {String} token Access token
   * @returns
   */
  static verifyAccessToken(token: string) {
    if (!SECRET_KEY) {
      throw new AppError(ERROR_MESSAGE.MissingAppCredentials);
    }

    return Jwt.verify(token, SECRET_KEY);
  }

  /**
   * Verify refresh token
   * @param {String} token Access token
   * @returns
   */
  static verifyRefreshToken(token: string) {
    if (!REFRESH_TOKEN_SECRET_KEY) {
      throw new AppError(ERROR_MESSAGE.MissingAppCredentials);
    }

    return Jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
  }

  /**
   * Decode token
   * @param {string} token The token
   * @returns {Object} token payload
   */
  static decodeToken(token: string) {
    return Jwt.decode(token);
  }
}
