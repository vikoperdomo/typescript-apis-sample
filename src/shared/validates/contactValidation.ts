import * as Joi from 'joi';
import { SUBMISSION_FORM_TYPE } from '../common/constants';

const contactFormDataSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().max(150).required(),
  message: Joi.string().required()
});

const newsletterFormDataSchema = Joi.object({
  email: Joi.string().email().required()
});

export const submissionFormSchema = Joi.object({
  type: Joi.string().valid(SUBMISSION_FORM_TYPE.Contact, SUBMISSION_FORM_TYPE.Newsletter).required(),
  formData: Joi.when('type', { is: SUBMISSION_FORM_TYPE.Contact, then: contactFormDataSchema })
    .when('type', { is: SUBMISSION_FORM_TYPE.Newsletter, then: newsletterFormDataSchema })
    .required()
});
