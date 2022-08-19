import { PublisherDataValues } from './../shared/interfaces/user.interface';
import { HttpRequest } from '@azure/functions';
import { morphism } from 'morphism';
import * as _ from 'lodash';

import { ERROR_MESSAGE } from '../shared/common/constants';
import { FilterOption, SearchRequest } from '../shared/common/types';
import { JwtBody, RegisterBodyRequest, UpdateUserPublisher, PublisherData } from '../shared/interfaces/user.interface';
import { PermissionError, RequestError } from '../shared/utils/error-util';
import { JwtUtil } from '../shared/utils/jwt-util';
import { guidValidation, searchSchema } from '../shared/validates/baseValidation';
import { DateUtil } from '../shared/utils/date-util';

/**
 * Validate search request body
 * @param {JoiSchema} schema Schema
 * @param {Object} requestBody The request
 * @returns {Void}
 */
export function validateRequestBody(schema: any, requestBody: any) {
  const validateResult = schema.validate(requestBody);
  if (validateResult.error) {
    const messages: Array<string> = validateResult.error.details.map((detail) => detail.message);
    throw new RequestError(messages.toString());
  }
}

/**
 * Validate guid
 * @param {UUID} itemId The record id
 * @returns {Void}
 */
export function validateGuid(itemId: string) {
  const validateResult = guidValidation.validate(itemId);
  if (validateResult.error) {
    const messages: Array<string> = validateResult.error.details.map((detail) => detail.message);
    throw new RequestError(messages.toString());
  }
}

/**
 * Validate search request body
 * @param {JoiSchema} schema Schema
 * @param {Object} requestBody The request
 * @returns {Void}
 */
export function validateSearchRequestBody(schema: any, requestBody: SearchRequest) {
  validateRequestBody(searchSchema, requestBody);

  const filterOptions2Entity = mappingFilterRequest(requestBody.filter);
  const validateResult = schema.validate(filterOptions2Entity);
  if (validateResult.error) {
    const messages: Array<string> = validateResult.error.details.map((detail) => detail.message);
    throw new RequestError(messages.toString());
  }
}

/**
 *
 * @param filterOptions
 */
function mappingFilterRequest(filterOptions: Array<FilterOption> = []) {
  const schema = {};
  filterOptions.forEach((filterOption: FilterOption) => {
    schema[filterOption.key] = filterOptions.values;
  });
}

/**
 *
 * @param request
 * @param mapperSearchRequestToModel
 * @returns
 */
export function mappingSearchFields2Model(request: SearchRequest, mapperSearchRequestToModel) {
  const requestMapped: SearchRequest = {
    pageIndex: request.pageIndex,
    pageSize: request.pageSize,
    filter: []
  };

  (request.filter || []).forEach((filterOption: FilterOption) => {
    requestMapped.filter.push({ key: mapperSearchRequestToModel[filterOption.key], operator: filterOption.operator, value: filterOption.value });
  });

  return requestMapped;
}

/**
 *
 * @param mapperModel
 * @param data
 * @returns
 */
export function morphismMapper(mapperModel: any, data: any) {
  return morphism(mapperModel, data);
}

/**
 * Check user access token
 * @param {HttpRequest} req The request
 * @returns {object} Token payload
 */
export async function authenticateToken(req: HttpRequest): Promise<JwtBody> {
  const { authorization: token } = req.headers;

  if (!token) {
    throw new PermissionError(ERROR_MESSAGE.AccessDenied);
  }

  const payload: JwtBody = (await JwtUtil.verifyAccessToken(token)) || {};

  if (!(payload.gameChatToken && payload.playFabId && payload.playFabSessionToken)) {
    throw new PermissionError(ERROR_MESSAGE.AccessDenied);
  }

  return payload;
}

/**
 * Remove empty attributes value in object
 * @param {object} srcObject
 * @returns {object}
 */
export function removeEmptyAttributesValue(srcObject: object): object {
  return Object.entries(srcObject)
    .filter(([_, v]) => v !== null && v !== '')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

/**
 * Shuffle data
 * @param {Array} data
 * @returns {Array} shuffle data
 */
export function shuffleData(data: Array<any>) {
  for (var i = data.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = data[i];
    data[i] = data[j];
    data[j] = temp;
  }

  return data;
}

/**
 * Check guest access token
 * @param {HttpRequest} req The request
 * @returns {object} Token payload
 */
export async function authenticateGuestToken(req: HttpRequest): Promise<JwtBody> {
  const { authorization: token } = req.headers;

  if (!token) {
    throw new PermissionError(ERROR_MESSAGE.AccessDenied);
  }

  const payload: JwtBody = (await JwtUtil.verifyAccessToken(token)) || {};

  if (!payload.gameChatToken) {
    throw new PermissionError(ERROR_MESSAGE.AccessDenied);
  }

  return payload;
}

/**
 * Get all participants email of scheduled performance
 * @param {} scheduledPerformance
 * @returns {Array<String>} List emails
 */
export function scheduledParticipantsEmail(scheduledPerformance): Array<string> {
  const participantsEmail: Array<string> = [];
  if (scheduledPerformance.superAdmins) {
    participantsEmail.concat(scheduledPerformance.superAdmins.split(',').map((item) => item.trim()));
  }

  scheduledPerformance.schedulingAccount && participantsEmail.push(scheduledPerformance.schedulingAccount);
  scheduledPerformance.targetArtistAccount && participantsEmail.push(scheduledPerformance.targetArtistAccount);

  return _.uniq(participantsEmail);
}

/**
 * Convert date-time to utc
 * @param {string} strDate
 * @returns
 */
export function convertToCosmosDate(strDate: string) {
  return DateUtil.convertToUTC(strDate);
}

/**
 *
 * @param {RegisterBodyRequest} body The request body
 * @returns {UpdateUserPublisher}
 */
export function defineUserPublisherData(body: RegisterBodyRequest | PublisherDataValues): UpdateUserPublisher {
  const publisherUpdateData: PublisherData = {
    pronoun: body.pronoun || '',
    birthdate: body.birthday || '',
    genre: body.genre || '',
    'marketing-optin': typeof body.marketingOptIn === 'boolean' ? JSON.stringify(body.marketingOptIn) : ''
  };

  if (typeof body.showWatchlist === 'object') {
    publisherUpdateData.showWatchlist = body.showWatchlist.length > 0 ? JSON.stringify(body.showWatchlist) : '[]';
  }

  return { Data: publisherUpdateData };
}
