import * as sgMail from '@sendgrid/mail';

import { EmailInfo } from '../shared/common/types';
import { ERROR_MESSAGE, INFO_MESSAGE } from '../shared/common/constants';
import { AppError } from '../shared/utils/error-util';
import { HTTP_CODE } from '../shared/utils/http-response';

export class EmailService {
  constructor() {}

  /**
   * Send email
   * @param {Array<string>} emailRecipients List of recipient email
   * @param {String} templateId The sendgrid email template id
   * @param dynamic_template_data The data of template
   */
  sendEmail(emailRecipients: Array<string>, templateId: string, templateData: any = {}): Promise<Boolean> {
    const apiKey: string = process.env.SENDGRID_API_KEY;
    const senderEmail: string = process.env.SENDER_EMAIL;
    if (!apiKey || !senderEmail) {
      throw new AppError(ERROR_MESSAGE.MissingAppCredentials, HTTP_CODE.Forbidden);
    }

    // Set sendgrid api key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const emailInfo: EmailInfo = {
      to: emailRecipients,
      from: senderEmail,
      templateId,
      dynamic_template_data: templateData
    };

    return sgMail
      .send(emailInfo)
      .then((response) => {
        global['context'].log('mail-sent-successfully', { templateId, templateData });
        return Promise.resolve(true);
      })
      .catch((error) => {
        global['context'].log('send-grid-error: ', error.toString());
        return Promise.reject(new AppError(ERROR_MESSAGE.RequestSendReminderFailed, HTTP_CODE.Forbidden));
      });
  }
}
