import { Context, HttpRequest } from '@azure/functions';
import { Moment } from 'moment';

import { GameChatService } from '../../services/gameChat.service';
import { COSMOS_DATE_FORMAT, GAME_SESSION_STATUS } from '../../shared/common/constants';
import { Response } from '../../shared/common/types';
import { SearchFields, SearchGameSessionsResult, GameSession, RequestSearchFields } from '../../shared/interfaces/game.interface';
import { requestToGameChatSearch } from '../../shared/mappers/gameChatMapper';
import { DateUtil } from '../../shared/utils/date-util';
import { HttpResponseUtil } from '../../shared/utils/http-response';
import { randomSearchGameSessions } from '../../shared/validates/gameValidatation';
import * as baseFunction from '../baseFunction';

export default async function (context: Context, req: HttpRequest) {
  const DEFAULT_RESPONSE_RECORD: number = 5;
  let responseData: Response;
  try {
    const { startedFrom, startedTo, status, limit, ignoreNoConnection } = req.query;
    const isIgnoreNoConnection: boolean = ignoreNoConnection === 'true';
    const limitRecord: number = Number(limit) || DEFAULT_RESPONSE_RECORD;
    const requestFilterOptions: RequestSearchFields = getRequestBody({ startedFrom, startedTo, status }, isIgnoreNoConnection);
    // Validate request params
    baseFunction.validateRequestBody(randomSearchGameSessions, requestFilterOptions);

    // Mapping request to model fields
    const filterSearchOptions: any = baseFunction.morphismMapper(requestToGameChatSearch, requestFilterOptions);
    removeUndefinedFields(filterSearchOptions);

    const searchResult: Array<GameSession> = await randomSearch(filterSearchOptions);
    const gameSessions: Array<GameSession> = searchResult.slice(0, limitRecord);
    responseData = HttpResponseUtil.ok(gameSessions, null, { body: { totalCount: searchResult.length } });
  } catch (error) {
    context.log.error(error);
    responseData = HttpResponseUtil.failed(error.message, error.statusCode);
  } finally {
    context.res = responseData;
    context.done();
  }
}

/**
 * Search game sessions and shuffle
 * @param {SearchFields} searchFields
 * @param {string} gameChatToken
 * @returns {Promise<Array<GameSession>>}
 */
async function randomSearch(searchFields: SearchFields): Promise<Array<GameSession>> {
  const statusList = (searchFields.status || '').split(',');

  if (!statusList.length) {
    const searchFieldsCleaned: SearchFields = baseFunction.removeEmptyAttributesValue(searchFields);

    return (await new GameChatService().searchGameSessions({ filterOptions: searchFieldsCleaned })).data;
  }

  const searchProcessPromises = [];
  statusList.forEach((status) => {
    searchFields.status = status.trim();

    const searchFieldsCleaned: SearchFields = baseFunction.removeEmptyAttributesValue(searchFields);
    searchProcessPromises.push(new GameChatService().searchGameSessions({ filterOptions: searchFieldsCleaned }));
  });

  const searchResults: Array<SearchGameSessionsResult> = await Promise.all(searchProcessPromises);
  const gameSessions: Array<GameSession> = [].concat(...searchResults.map((item) => item.data));

  return baseFunction.shuffleData(gameSessions);
}

/**
 * Default params value
 * @param {boolean} isIgnoreNoConnection ignore no connection option
 * @returns {SearchFields} The request filter fields
 */
function defaultRequestFilterOptions(isIgnoreNoConnection: boolean): RequestSearchFields {
  return {
    status: `${GAME_SESSION_STATUS.Live},${GAME_SESSION_STATUS.Past}`,
    ignoreNoConnection: isIgnoreNoConnection,
    startedTo: DateUtil.currentDate(COSMOS_DATE_FORMAT) as string,
    startedFrom: (DateUtil.currentDate() as Moment).subtract(30, 'days').format(COSMOS_DATE_FORMAT)
  };
}

/**
 * Update request filter options
 * @param {RequestSearchFields} filterOptions The request filter fields
 * @param {boolean} ignoreNoConnection Ignore no connection records
 * @returns {RequestSearchFields}
 */
function getRequestBody(filterOptions: RequestSearchFields, ignoreNoConnection: boolean): RequestSearchFields {
  if (Object.values(filterOptions).filter((item) => item).length) {
    filterOptions.ignoreNoConnection = ignoreNoConnection;

    if (filterOptions.startedFrom) {
      filterOptions.startedFrom = baseFunction.convertToCosmosDate(filterOptions.startedFrom);
    }

    if (filterOptions.startedTo) {
      filterOptions.startedTo = baseFunction.convertToCosmosDate(filterOptions.startedTo);
    }

    return filterOptions;
  }

  return defaultRequestFilterOptions(ignoreNoConnection);
}

/**
 * Remove non value fields
 * @param {any} requestEntity The mapped request body
 * @returns {any} Entity cleaned
 */
function removeUndefinedFields(searchBody: any): any {
  Object.keys(searchBody).forEach((key) => (searchBody[key] === undefined ? delete searchBody[key] : {}));
  return searchBody;
}
