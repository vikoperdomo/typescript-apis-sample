import Joi = require('joi');

export const guidValidation = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required();

export const searchSchema = Joi.object({
  pageIndex: Joi.number().required(),
  pageSize: Joi.number().required(),
  filter: Joi.array().items(
    Joi.object({
      key: Joi.string().required(),
      operator: Joi.string().required(),
      value: Joi.alternatives()
        .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean())))
        .required()
    }).optional()
  )
});
