import { COSMOS_DATE_FORMAT, ERROR_MESSAGE, USER_ROLE } from '../common/constants';
import { JwtBody } from '../interfaces/user.interface';
import { PermissionError } from './error-util';
import { HttpResponseUtil, HTTP_CODE } from './http-response';
import { JwtUtil } from './jwt-util';
import { GameChatService } from '../../services/gameChat.service';
import { GetSessionsBody } from '../interfaces/game.interface';
import { DateUtil } from './date-util';

export const mustBeProducer = () => {
  return (next) => {
    return async (context, req) => {
      try {
        const { authorization: token } = req.headers;
        if (!token) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        const payload: JwtBody = (await JwtUtil.verifyAccessToken(token)) || {};
        if (!isValidProducerToken(payload)) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        return next(context, req, payload);
      } catch (error) {
        context.res = HttpResponseUtil.failed(error.message, HTTP_CODE.UnAuthorize);
        return context.done();
      }
    };
  };
};

export const mustBeUser = () => {
  return (next) => {
    return async (context, req) => {
      try {
        const { authorization: token } = req.headers;
        if (!token) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        const payload: JwtBody = (await JwtUtil.verifyAccessToken(token)) || {};
        if (!isValidFSLToken(payload)) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        return next(context, req, payload);
      } catch (error) {
        context.res = HttpResponseUtil.failed(error.message, HTTP_CODE.UnAuthorize);
        return context.done();
      }
    };
  };
};

export const mustBeGuest = () => {
  return (next) => {
    return async (context, req) => {
      try {
        const { authorization: token } = req.headers;
        if (!token) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        const payload: JwtBody = (await JwtUtil.verifyAccessToken(token)) || {};
        if (!(payload.gameChatToken && payload.playFabSessionToken)) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        return next(context, req, payload);
      } catch (error) {
        context.res = HttpResponseUtil.failed(error.message, HTTP_CODE.UnAuthorize);
        return context.done();
      }
    };
  };
};

/**
 * Check the token is producer
 * @param {JwtBody} payload payload token
 * @returns {Boolean}
 */
function isValidProducerToken(payload: JwtBody = {}) {
  const isValidToken: boolean = isValidFSLToken(payload);
  const isProducer: boolean = payload.role === USER_ROLE.Producer;

  return isValidToken && isProducer;
}

/**
 * Check is valid token
 * @param {JwtBody} payload
 * @returns {Boolean}
 */
function isValidFSLToken(payload: JwtBody = {}) {
  return Boolean(payload.gameChatToken && payload.playFabId && payload.playFabSessionToken && payload.email);
}

export const mustBeGameChatUser = () => {
  return (next) => {
    return async (context, req) => {
      try {
        const { authorization: token } = req.headers;
        if (!token) {
          throw new PermissionError(ERROR_MESSAGE.AccessDenied);
        }

        await isValidGameChatUser(token);

        return next(context, req);
      } catch (error) {
        context.res = HttpResponseUtil.failed(error.message, HTTP_CODE.UnAuthorize);
        return context.done();
      }
    };
  };
};

/**
 * Hard code to check the game chat token is valid or not
 * @param {string} gameChatToken The game chat token
 * @returns {}
 */
async function isValidGameChatUser(gameChatToken: string) {
  const searchBody: GetSessionsBody = {
    pageIndex: 1,
    pageSize: 1,
    filterOptions: { timeStartedFrom: DateUtil.currentDate(COSMOS_DATE_FORMAT) as string }
  };

  return await new GameChatService().searchGameSessions(searchBody);
}
