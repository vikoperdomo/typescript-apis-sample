import { GAME_SESSION_STATUS } from '../common/constants';
const Joi = require('joi').extend(require('@joi/date'));

export const searchGameSessionsSchema = Joi.object({
  pageIndex: Joi.number().min(1),
  pageSize: Joi.number().min(1),
  filterOptions: Joi.object({
    searchText: Joi.string(),
    ignoreNoConnection: Joi.boolean(),
    status: Joi.string().valid(GAME_SESSION_STATUS.Pending, GAME_SESSION_STATUS.Live, GAME_SESSION_STATUS.Past),
    genre: Joi.string().max(100),
    timeStartedFrom: Joi.date().iso(),
    timeStartedTo: Joi.date().iso()
  })
});

const statusListValidation = (value, helpers) => {
  const statusList: Array<string> = (value || '').split(',');
  const validStatusList: Array<string> = [GAME_SESSION_STATUS.Pending, GAME_SESSION_STATUS.Live, GAME_SESSION_STATUS.Past];
  for (let i = 0; i < statusList.length; i++) {
    if (!validStatusList.includes(statusList[i])) {
      return helpers.error('any.invalid');
    }
  }

  return value;
};

export const randomSearchGameSessions = Joi.object({
  status: Joi.string().custom(statusListValidation, 'custom validation'),
  startedFrom: Joi.date().iso(),
  startedTo: Joi.date().iso(),
  ignoreNoConnection: Joi.boolean(),
  limit: Joi.number()
});

export const gameSessionIdSchema = Joi.string().required();
