import { ERROR_MESSAGE, FILE_FORMAT, GAMECHAT_ROUTES, YOUTUBE_QUALITY, YOUTUBE_THUMBNAIL_URL } from '../shared/common/constants';
import { RequestOptions } from '../shared/common/types';
import {
  FilterBeforeSearch,
  GameSession,
  GameSessionFilterOptions,
  GetSessionsBody,
  SearchGameSessionsResult
} from '../shared/interfaces/game.interface';
import { GameChatLoginBody, LoginGameChatResponse } from '../shared/interfaces/user.interface';
import { AppError } from '../shared/utils/error-util';
import { HTTP_CODE } from '../shared/utils/http-response';
import { RequestUtil } from '../shared/utils/request-util';

export class GameChatService {
  constructor() {}

  /**
   *
   * @param {string} email Email login
   * @param {string} password The user password
   * @returns {LoginGameChatResponse}
   */
  async loginAndReturnSession(email: string, password: string): Promise<LoginGameChatResponse> {
    const loginUri: string = `${this.gameChatEndpoint()}/${GAMECHAT_ROUTES.LoginAndReturnSession}`;
    const loginBody: GameChatLoginBody = {
      login: email,
      password: password
    };

    return RequestUtil.post(loginUri, loginBody);
  }

  /**
   * Define game chat endpoint
   * @returns {String}
   */
  private gameChatEndpoint(): string {
    const gameChatEndpoint: string = process.env.GAMECHAT_ENDPOINT;
    if (!gameChatEndpoint) {
      throw new AppError(ERROR_MESSAGE.MissingGameChatEndpoint);
    }

    return `${gameChatEndpoint}/api`;
  }

  /**
   *
   * @param {string} gameChatToken User token
   * @param {GetSessionsBody} body The filter body
   * @returns {SearchGameSessionsResult}
   */
  async searchGameSessions(body: GetSessionsBody): Promise<SearchGameSessionsResult> {
    const filterOptions: GameSessionFilterOptions = body.filterOptions || {};
    const ignoreNoConnection: boolean = this.getIgnoreNoConnectionValue(filterOptions);

    const getGameSessionsUri = this.searchGameSessionsUrl(filterOptions);
    const searchBody = { propertyFilter: body.propertyFilter || {} };
    const searchResults: Array<GameSession> = await RequestUtil.post(getGameSessionsUri, searchBody);

    let gameSessions: Array<GameSession> = this.filterAndAddThumbnail(searchResults, { ignoreNoConnection });
    const totalCount: number = gameSessions.length;

    const { pageSize, pageIndex } = body;
    if (pageSize && pageIndex) {
      const startIndex: number = (pageIndex - 1) * pageSize;
      const endIndex: number = startIndex + pageSize;

      gameSessions = gameSessions.slice(startIndex, endIndex);
    }

    return { data: gameSessions, totalCount };
  }

  /**
   * Filter before search on game sessions and add youtube thumbnail
   * @param {Array<GameSession>} searchResults Search result
   * @param {FilterBeforeSearch} options
   * @returns {Array<GameSession>} The returns
   */
  private filterAndAddThumbnail(searchResults: Array<GameSession>, options: FilterBeforeSearch = {}): Array<GameSession> {
    const gameSessions: Array<GameSession> = [];
    searchResults.forEach((gameSession: GameSession) => {
      gameSession.id = (gameSession.id || '').replace('yt-', '');
      gameSession.youtubeThumbnail = `${YOUTUBE_THUMBNAIL_URL}/${gameSession.id}/${YOUTUBE_QUALITY.Maximum}.${FILE_FORMAT.Jpg}`;
      if (options.ignoreNoConnection) {
        gameSession.totalConnections > 0 && gameSessions.push(gameSession);
      } else {
        gameSessions.push(gameSession);
      }
    });

    return gameSessions;
  }

  /**
   * Ignore no connection
   * @param {GameSessionFilterOptions} filterOptions
   * @returns {Boolean}
   */
  private getIgnoreNoConnectionValue(filterOptions: GameSessionFilterOptions): boolean {
    let ignoreNoConnection: boolean = false;
    if (filterOptions.ignoreNoConnection != undefined) {
      ignoreNoConnection = filterOptions.ignoreNoConnection;
      delete filterOptions.ignoreNoConnection;
    }

    return ignoreNoConnection;
  }

  /**
   * Define search game sessions url + params
   * @param {GameSessionFilterOptions} filterOptions
   * @returns {URL}
   */
  private searchGameSessionsUrl(filterOptions: GameSessionFilterOptions): URL {
    const getGameSessionsUri = new URL(`${this.gameChatEndpoint()}/${GAMECHAT_ROUTES.GetGameSessions}`);
    getGameSessionsUri.search = new URLSearchParams(filterOptions as any).toString();

    return getGameSessionsUri;
  }

  /**
   * Get game session by session id
   * @param {string} gameChatToken
   * @param {string} sessionId
   * @returns
   */
  async getGameSessionById(sessionId: string): Promise<GameSession> {
    try {
      const getGameSessionsUri: string = `${this.gameChatEndpoint()}/${GAMECHAT_ROUTES.GetById}?streamUri=${`yt-${sessionId}`}`;
      const existingGameSession: GameSession = await RequestUtil.get(getGameSessionsUri);

      const gameSessions: Array<GameSession> = this.filterAndAddThumbnail([existingGameSession], {});
      return gameSessions[0];
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
