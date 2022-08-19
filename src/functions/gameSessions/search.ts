import { Context, HttpRequest } from '@azure/functions';
import { GameChatService } from '../../services/gameChat.service';
import { DEFAULT_PAGE_INDEX } from '../../shared/common/constants';
import { Response } from '../../shared/common/types';
import { GameSessionFilterOptions, GetSessionsBody, SearchGameSessionsResult } from '../../shared/interfaces/game.interface';
import { HttpResponseUtil } from '../../shared/utils/http-response';
import { searchGameSessionsSchema } from '../../shared/validates/gameValidatation';
import { validateRequestBody, convertToCosmosDate } from '../baseFunction';

export default async function (context: Context, req: HttpRequest) {
  let responseData: Response;
  try {
    const body: GetSessionsBody = getRequestBody(req.body);
    const { pageSize, pageIndex } = req.body;
    // Validate request body
    validateRequestBody(searchGameSessionsSchema, body);

    const result: SearchGameSessionsResult = await new GameChatService().searchGameSessions(body);

    responseData = HttpResponseUtil.ok(result.data, null, {
      body: { pageIndex: pageIndex || DEFAULT_PAGE_INDEX, pageSize: pageSize || result.totalCount, totalCount: result.totalCount }
    });
  } catch (error) {
    context.log.error(error);
    responseData = HttpResponseUtil.failed(error.message, error.statusCode);
  } finally {
    context.res = responseData;
    context.done();
  }
}

/**
 * Get request body
 * @param {GetSessionsBody} requestBody The request body
 * @returns
 */
function getRequestBody(requestBody: GetSessionsBody): GetSessionsBody {
  const filterOptions: GameSessionFilterOptions = requestBody.filterOptions;
  if (filterOptions) {
    if (filterOptions.timeStartedFrom) {
      requestBody.filterOptions.timeStartedFrom = convertToCosmosDate(filterOptions.timeStartedFrom);
    }

    if (filterOptions.timeStartedTo) {
      requestBody.filterOptions.timeStartedTo = convertToCosmosDate(filterOptions.timeStartedTo);
    }
  }

  return requestBody;
}
