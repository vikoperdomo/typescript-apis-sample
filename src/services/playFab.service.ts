import * as _ from 'lodash';
import { ERROR_MESSAGE, EXECUTE_FUNCTIONS, PLAYFAB_API_TYPE, PLAYFAB_ROUTES } from '../shared/common/constants';
import {
  GetFirebaseUserRequest,
  PlayfabRequestOptions,
  SubmissionFormData,
  UpdateConnectionBody,
  UpdateInternalDataBody
} from '../shared/interfaces/playfab.interface';
import {
  PlayFabLoginBody,
  PlayFabApiResponse,
  PlayFabLoginResponseData,
  PlayFabUser,
  PlayFabRegisterResponseData,
  RegisterResult,
  UpdateContactEmailBody,
  UpdateUserPublisher,
  UpdateUserPublisherDataResponse,
  ProfileConstraints,
  PlayerProfileRequestBody,
  PlayerProfileResponse,
  PlayerProfile,
  PublisherDataResponse,
  RawPublisherData,
  ExecuteFunctionBody,
  ExecuteScriptResponseData,
  Permissions,
  ExecuteFunctionParameter,
  FriendRequestParameters,
  ResponseFriendRequestParams,
  PlayfabFriend
} from '../shared/interfaces/user.interface';
import { PlayFabForgotPasswordBody } from '../shared/interfaces/user.interface';
import { AppError } from '../shared/utils/error-util';
import { HTTP_CODE } from '../shared/utils/http-response';
import { RequestUtil } from '../shared/utils/request-util';

export class PlayFabService {
  constructor() {}

  /**
   * Register PlayFab account
   * @param {PlayFabUser} userData The user info
   * @returns {}
   */
  async registerPlayFab(userData: PlayFabUser): Promise<RegisterResult> {
    userData.TitleId = process.env.PLAYFAB_TITLE_ID;
    const registerUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.Register}`;

    const registerResult: PlayFabApiResponse<PlayFabRegisterResponseData> = await RequestUtil.post(registerUri, userData);
    if (registerResult.code === HTTP_CODE.Success || registerResult.code === HTTP_CODE.Created) {
      const data: PlayFabRegisterResponseData = registerResult.data;

      return {
        id: data.PlayFabId,
        userName: data.Username,
        sessionTicket: data.SessionTicket,
        entityToken: data.EntityToken.EntityToken
      };
    }

    throw new AppError(registerResult.errorMessage, registerResult.code);
  }

  /**
   *
   * @param {PlayFabUser} userData
   * @returns
   */
  async updateUserPublisherData(userData: UpdateUserPublisher, authorization: string) {
    const updateUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.UpdateUserPublisherData}`;
    const options = { headers: { 'X-Authorization': authorization } };
    const updateResult: PlayFabApiResponse<UpdateUserPublisherDataResponse> = await RequestUtil.post(updateUri, userData, options);
    if (updateResult.code === HTTP_CODE.Success || updateResult.code === HTTP_CODE.Created) {
      return {
        dataVersion: updateResult.data.DataVersion
      };
    }

    throw new AppError(updateResult.errorMessage, updateResult.code);
  }

  /**
   * Add/Update contact email
   * @param {string} email User email
   * @param {string} authorization
   * @returns
   */
  async addOrUpdateContactEmail(email: string, authorization: string) {
    const updateUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.AddOrUpdateContactEmail}`;
    const bodyUpdate: UpdateContactEmailBody = { EmailAddress: email };
    const options = { headers: { 'X-Authorization': authorization } };

    const updateResult: PlayFabApiResponse<object> = await RequestUtil.post(updateUri, bodyUpdate, options);
    if (updateResult.code === HTTP_CODE.Success || updateResult.code === HTTP_CODE.Created) {
      return true;
    }

    throw new AppError(updateResult.errorMessage, updateResult.code);
  }

  /**
   * Login
   * @param {string} email The email
   * @param {string} password The password
   * @returns {PlayFabLoginResponseData}
   */
  async loginWithEmail(email: string, password: string): Promise<PlayFabLoginResponseData> {
    const loginUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.LoginWithEmail}`;
    const loginBody: PlayFabLoginBody = {
      TitleId: process.env.PLAYFAB_TITLE_ID,
      Email: email,
      Password: password
    };
    const loginResult: PlayFabApiResponse<PlayFabLoginResponseData> = await RequestUtil.post(loginUri, loginBody);

    if (loginResult.code === HTTP_CODE.Success) {
      return loginResult.data;
    }

    throw new AppError(loginResult.errorMessage, loginResult.code);
  }

  /**
   * Define PlayFab endpoint
   * @param {string} apiType playFab Api type
   * @returns {string} PlayFab uri
   */
  private playFabEndPoint(apiType: string = PLAYFAB_API_TYPE.Client): string {
    const titleId: string = process.env.PLAYFAB_TITLE_ID;
    const playFabEndPoint: string = process.env.PLAYFAB_ENDPOINT;
    if (!titleId || !playFabEndPoint) {
      throw new AppError(ERROR_MESSAGE.MissingPlayFabInfo);
    }

    return `https://${titleId}.${playFabEndPoint}/${apiType}`;
  }

  /**
   * Get play fab secure headers
   * @returns {Object}
   */
  private playFabSecureHeaders() {
    const secretKey: string = process.env.PLAYFAB_SECRET_KEY;
    if (!secretKey) {
      throw new AppError(ERROR_MESSAGE.MissingPlayFabInfo, HTTP_CODE.UnAuthorize);
    }

    return { 'X-SecretKey': secretKey };
  }

  /**
   * Forgot password
   * @param email User email
   * @returns {object}
   */
  async forgotPassword(email: string) {
    const titleId = process.env.PLAYFAB_TITLE_ID;
    const emailTemplateId = process.env.PLAYFAB_EMAIL_TEMPLATE_ID;
    if (!titleId || !emailTemplateId) {
      throw new AppError(ERROR_MESSAGE.MissingPlayFabInfo, HTTP_CODE.UnAuthorize);
    }

    const forgotPasswordUri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.Server)}/${PLAYFAB_ROUTES.ForgotPassword}`;
    const headers = this.playFabSecureHeaders();

    const forgotPasswordBody: PlayFabForgotPasswordBody = {
      TitleId: titleId,
      Email: email,
      EmailTemplateId: emailTemplateId
    };

    const results: PlayFabApiResponse<object> = await RequestUtil.post(forgotPasswordUri, forgotPasswordBody, { headers });
    if (results.code === HTTP_CODE.Success) {
      return results.data;
    }

    throw new AppError(results.errorMessage, results.code);
  }

  /**
   * Update avatar url
   * @param {String} playFabId User session ticket
   * @param {string} fileName
   * @returns
   */
  async updateAvatar(playFabId: string, fileName: string) {
    const titleId = process.env.PLAYFAB_TITLE_ID;

    const updateAvatarUri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.Server)}/${PLAYFAB_ROUTES.UpdateUserAvatar}`;
    const headers = this.playFabSecureHeaders();

    const storageEndPoint: string = process.env.STORAGE_ENDPOINT;
    const storageContainer: string = process.env.STORAGE_CONTAINER;

    if (!(storageEndPoint && storageContainer && fileName)) {
      throw new AppError(ERROR_MESSAGE.MissingAzureInfo);
    }

    const body = {
      TitleId: titleId,
      PlayFabId: playFabId,
      ImageUrl: `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_CONTAINER}/${fileName}`
    };

    const results: PlayFabApiResponse<object> = await RequestUtil.post(updateAvatarUri, body, { headers });
    if (results.code === HTTP_CODE.Success) {
      return results.data;
    }

    throw new AppError(results.errorMessage, results.code);
  }

  /**
   * Get Player profile
   * @param {string} sessionToken Session ticket
   * @param {string} playFabId userId
   * @param {ProfileConstraints} ProfileConstraints Profile constraints
   * @returns {PlayerProfile}
   */
  async getPlayerProfile(sessionToken: string, playFabId: string, profileConstraints: ProfileConstraints = {}): Promise<PlayerProfile> {
    const getProfileUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.GetPlayerProfile}`;

    const body: PlayerProfileRequestBody = {
      PlayFabId: playFabId,
      ProfileConstraints: _.merge(
        {
          ShowContactEmailAddresses: true,
          ShowDisplayName: true,
          ShowAvatarUrl: true,
          ShowStatistics: true
        },
        profileConstraints
      )
    };

    const options: PlayfabRequestOptions = { headers: { 'X-Authorization': sessionToken } };

    const results: PlayFabApiResponse<PlayerProfileResponse> = await RequestUtil.post(getProfileUri, body, options);
    if (results.code === HTTP_CODE.Success) {
      return results.data.PlayerProfile;
    }

    throw new AppError(results.errorMessage, results.code);
  }

  /**
   * Get user publisher data
   * @param {string} sessionToken session ticket
   * @param {string} playFabId playfab id
   * @returns {UserPublisherData}
   */
  async getUserPublisherData(sessionToken: string, playFabId: string): Promise<RawPublisherData> {
    const getPublisherDataUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.GetUserPublisherData}`;

    const body: PlayerProfileRequestBody = {
      PlayFabId: playFabId
    };

    const options: PlayfabRequestOptions = { headers: { 'X-Authorization': sessionToken } };

    const results: PlayFabApiResponse<PublisherDataResponse> = await RequestUtil.post(getPublisherDataUri, body, options);
    if (results.code === HTTP_CODE.Success) {
      return results.data.Data;
    }

    throw new AppError(results.errorMessage, results.code);
  }

  /**
   * Send email to subscriber
   * @param {string} entityToken X entity token
   * @param {string} playFabId Playfab user id
   */
  async sendEmailSubscriber(entityToken: string): Promise<void> {
    const emailTemplateId = process.env.EMAIL_MARKETING_OPT_IN_TEMPLATE_ID;
    if (emailTemplateId) {
      const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.CloudScript)}/${PLAYFAB_ROUTES.ExecuteFunction}`;
      const options = { headers: { 'X-EntityToken': entityToken } };
      const body: ExecuteFunctionBody<ExecuteFunctionParameter> = {
        FunctionName: EXECUTE_FUNCTIONS.AddSubscriberToSendGrid,
        FunctionParameter: { listId: emailTemplateId }
      };

      await RequestUtil.post(uri, body, options)
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  }

  /**
   * Get Producer data
   * @param {string} playFabToken user token
   * @returns {Permissions} User permission
   */
  async getProducerData(playFabToken: string): Promise<Permissions> {
    const getProducerDataUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.ExecuteCloudScript}`;
    const options = { headers: { 'X-Authorization': playFabToken } };
    const body: ExecuteFunctionBody<ExecuteFunctionParameter> = {
      FunctionName: EXECUTE_FUNCTIONS.getProducerData,
      FunctionParameter: {
        dataType: 'permissions'
      }
    };

    const results: PlayFabApiResponse<ExecuteScriptResponseData> = await RequestUtil.post(getProducerDataUri, body, options);
    if (results.code === HTTP_CODE.Success && results.data.FunctionResult.permissions) {
      return results.data.FunctionResult.permissions;
    }

    return null;
  }

  /**
   * Submit contact-us or newsletter
   * @param {SubmissionFormData} submissionFormData Submission form data
   * @param {string} playFabToken user token
   * @returns {Void}
   */
  async submissionForm(submissionFormData: SubmissionFormData, playFabToken: string): Promise<void> {
    const submissionFormUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.ExecuteCloudScript}`;
    const options = { headers: { 'X-Authorization': playFabToken } };
    const body: ExecuteFunctionBody<SubmissionFormData> = {
      FunctionName: EXECUTE_FUNCTIONS.SubmitContactUs,
      FunctionParameter: submissionFormData
    };

    const results: PlayFabApiResponse<ExecuteScriptResponseData> = await RequestUtil.post(submissionFormUri, body, options);
    if (results.code === HTTP_CODE.Success && results.data.FunctionResult) {
      return;
    }

    const errorMessage: string = (results.data.Error || {}).Message || results.errorMessage;
    throw new AppError(errorMessage, results.code);
  }

  /**
   * Add friend request
   * @param {String} friendId Target friend email or username
   * @param {String} playFabId The playfab user ID
   * @return {}
   */
  async addFriendRequest(friendId: string, playFabId, entityToken: string): Promise<any> {
    const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.CloudScript)}/${PLAYFAB_ROUTES.ExecuteFunction}`;
    const options = { headers: { 'X-EntityToken': entityToken } };
    const body: ExecuteFunctionBody<FriendRequestParameters> = {
      FunctionName: EXECUTE_FUNCTIONS.AddFriendRequest,
      PlayFabId: playFabId,
      FunctionParameter: { targetFriend: friendId }
    };

    return await RequestUtil.post(uri, body, options)
      .then((data) => Promise.resolve({ success: true, friendId: body.FunctionParameter.targetFriend }))
      .catch((error) => {
        console.log(error);
        return Promise.resolve({ success: false, error, friendId: body.FunctionParameter.targetFriend });
      });
  }

  /**
   * Add friend request
   * @param {String} friendId Target friend email or username
   * @param {String} playFabId The playfab user ID
   * @return {}
   */
  async responseRequestFriend(friendInfo: any, playFabId, entityToken: string): Promise<any> {
    const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.CloudScript)}/${PLAYFAB_ROUTES.ExecuteFunction}`;
    const options = { headers: { 'X-EntityToken': entityToken } };
    const body: ExecuteFunctionBody<ResponseFriendRequestParams> = {
      FunctionName: EXECUTE_FUNCTIONS.ResponseFriendRequest,
      PlayFabId: playFabId,
      FunctionParameter: {
        targetFriendPlayFabId: friendInfo.friendId,
        targetFriendDisplayName: friendInfo.displayName,
        approveRequest: friendInfo.isAccept
      }
    };

    return await RequestUtil.post(uri, body, options)
      .then((data) => Promise.resolve(data))
      .catch((error) => Promise.reject(error));
  }

  /**
   * Get user friends list
   * @param {String} playfabToken The playfab user token
   * @param {object} bodyOptions The body request
   * @returns {Array<PlayfabFriend>} The friends
   */
  async getFriendsList(playfabToken: string): Promise<Array<PlayfabFriend>> {
    const friendsListUri: string = `${this.playFabEndPoint()}/${PLAYFAB_ROUTES.GetFriendsList}`;
    const options = { headers: { 'X-Authorization': playfabToken } };
    const bodyRequest: GetFirebaseUserRequest = {
      ProfileConstraints: {
        ShowAvatarUrl: true,
        ShowStatistics: true
      }
    };

    const getResult: PlayFabApiResponse<any> = await RequestUtil.post(friendsListUri, bodyRequest, options);
    if (getResult.code === HTTP_CODE.Success) {
      return getResult.data.Friends;
    }

    throw new AppError(getResult.errorMessage, getResult.code);
  }

  /**
   * Update user connection
   * @param {UpdateConnectionBody} updateConnectionBody
   * @param {string} entityToken
   */
  async updateUserConnection(updateConnectionBody: UpdateConnectionBody, playFabId: string, entityToken: string): Promise<any> {
    const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.CloudScript)}/${PLAYFAB_ROUTES.ExecuteFunction}`;
    const options = { headers: { 'X-EntityToken': entityToken } };
    const body: ExecuteFunctionBody<UpdateConnectionBody> = {
      FunctionName: EXECUTE_FUNCTIONS.UpdateUserConnection,
      PlayFabId: playFabId,
      FunctionParameter: updateConnectionBody
    };

    return await RequestUtil.post(uri, body, options)
      .then((data) => Promise.resolve(data))
      .catch((error) => Promise.reject(error));
  }

  /**
   * Get user account info by email
   * @param {String} email The user email
   * @returns {Promise} Get User response
   */
  async getUserAccountByEmail(email: string): Promise<any> {
    const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.Admin)}/${PLAYFAB_ROUTES.GetUserAccountInfo}`;
    const options: PlayfabRequestOptions = { headers: this.playFabSecureHeaders() };
    const body: any = { Email: email };

    return await RequestUtil.post(uri, body, options)
      .then((data) => Promise.resolve(data))
      .catch((error) => {
        return Promise.resolve(null);
      });
  }

  /**
   * Update user internal data
   * @param {String} playfabId The user email
   * @param {String} internalData The user email
   * @returns {Promise} Get User response
   */
  async updateUserInternalData(updateData: UpdateInternalDataBody): Promise<any> {
    const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.Admin)}/${PLAYFAB_ROUTES.UpdateUserInternalData}`;
    const options: PlayfabRequestOptions = { headers: this.playFabSecureHeaders() };

    return await RequestUtil.post(uri, updateData, options)
      .then((data) => Promise.resolve(data))
      .catch((error) => {
        console.log('Update user internal data failed', updateData);
        console.error('Reason', error);
        return Promise.resolve(null);
      });
  }

  /**
   * Get user internal data
   * @param  {String} playfabId The playfab id
   * @returns {}
   */
  async getUserInternalData(playfabId: string): Promise<any> {
    const uri: string = `${this.playFabEndPoint(PLAYFAB_API_TYPE.Admin)}/${PLAYFAB_ROUTES.GetUserInternalData}`;
    const options: PlayfabRequestOptions = { headers: this.playFabSecureHeaders() };
    const body: any = { PlayFabId: playfabId };

    return await RequestUtil.post(uri, body, options)
      .then((data) => Promise.resolve(data))
      .catch((error) => {
        return Promise.resolve(null);
      });
  }
}
