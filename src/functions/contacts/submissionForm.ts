import { mustBeGuest } from './../../shared/utils/auth';
import { Context, HttpRequest } from '@azure/functions';
import { submissionFormSchema } from '../../shared/validates/contactValidation';
import { validateRequestBody } from '../baseFunction';
import { Response } from '../../shared/common/types';
import { HttpResponseUtil, HTTP_CODE } from '../../shared/utils/http-response';
import { JwtBody } from '../../shared/interfaces/user.interface';
import { PlayFabService } from '../../services/playFab.service';

export default mustBeGuest()(async function (context: Context, req: HttpRequest, jwtBody: JwtBody) {
  let responseData: Response;
  try {
    let body = req.body;
    // Validate request entity
    validateRequestBody(submissionFormSchema, body);
    await new PlayFabService().submissionForm(body, jwtBody.playFabSessionToken);
    responseData = HttpResponseUtil.ok({}, HTTP_CODE.Success);
  } catch (error) {
    context.log.error(error);
    responseData = HttpResponseUtil.failed(error.message, error.statusCode);
  } finally {
    context.res = responseData;
    context.done();
  }
});
