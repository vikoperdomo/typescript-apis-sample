export const COSMOS_CONTAINER = {
  Schedule: 'schedules',
  User: 'users'
};

export const ERROR_MESSAGE = {
  MissingItem: 'Missing item.',
  MissingCreateItem: 'Missing item to create.',
  MissingUpdateItem: 'Missing item to update.',
  ItemNotFound: 'Item not found.',
  MissingItemId: 'Missing item Id.',
  NoItems: 'No items passed to clean items.',
  PaginationInfoMustRequired: 'Page index or page number is required field.',
  InvalidDateFormat: 'Dates must be formatted according to ISO8601',
  InvalidTimeRangeInput: 'Start time must be before the end time',
  InvalidFilterValue: 'Invalid filter value',
  RecordNotFound: 'Record not found',
  FileNotFound: 'File not found',
  MissingAzureInfo: 'Missing storage information.',
  SheetIdNotExists: 'Spreadsheets does not exists.',
  SheetNameNotExists: 'Sheet name does not exists',
  MissingPlayFabInfo: 'Missing playfab credentials',
  MissingGameChatEndpoint: 'Missing game chat endpoint',
  MissingAppCredentials: 'Missing app credentials',
  AccessDenied: 'Access Denied',
  Unauthorized: 'Unauthorized',
  InvalidUpdateStatus: 'Unable to update the current status %s to %s.',
  InvalidScheduleStartTime: 'Invalid start time.',
  CannotReminder: 'Cannot send email prompt to all participants when the scheduled performance is started',
  RequestSendReminderFailed: 'Request to send email reminder failed',
  CannotEndScheduledPerformance: `Can't concluded before the end time`,
  CannotChangeStartTime: `Can't change start date-time when the status is`,
  UserNotFound: 'User not found',
  ErrorOccurred: 'Error occurs',
  SessionHasBeenAdded: 'The game session has been added',
  GameSessionNotFound: 'Game session not found'
};

export const INFO_MESSAGE = {
  DoneSendEmailParticipants: 'Send email to all participants on scheduled performance successfully.',
  UpdateScheduleSuccess: 'Update scheduled performance successfully.',
  ProfileUpdated: 'Profile updated successfully',
  RemovedVideoFromPlaylist: 'Game session has been removed from the playlist.',
  AddedVideoToPlaylist: 'Game session has been added to the playlist.',
  SentFriendRequest: 'Friend request has been sent',
  AcceptedFriendRequest: 'Friend request has been accepted',
  DeclinedFriendRequest: 'Friend request has been declined',
  UpdateUserConnectionSuccess: 'Update user connection successfully.'
};

export const SCHEDULE_STATUS = {
  Scheduled: 'scheduled',
  Live: 'live',
  Concluded: 'concluded',
  Abandoned: 'abandoned'
};

export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.fffffffZ';
export const FILTER_DATE_FORMAT = 'YYYY-MM-DDTHH:mm';
export const STORAGE_SUB_FOLDER = {
  User: 'users/'
};

export const SHEET_RANGE_DEFAULT = 'Sheet1!A:B';

export const PLAYFAB_API_TYPE = {
  Server: 'Server',
  Client: 'Client',
  CloudScript: 'CloudScript',
  Admin: 'Admin'
};

export const PLAYFAB_ROUTES = {
  LoginWithEmail: 'LoginWithEmailAddress',
  Register: 'RegisterPlayFabUser',
  UpdateUserPublisherData: 'UpdateUserPublisherData',
  AddOrUpdateContactEmail: 'AddOrUpdateContactEmail',
  ForgotPassword: 'SendCustomAccountRecoveryEmail',
  UpdateUserAvatar: 'UpdateAvatarUrl',
  GetUserPublisherData: 'GetUserPublisherData',
  GetPlayerProfile: 'GetPlayerProfile',
  ExecuteFunction: 'ExecuteFunction',
  ExecuteCloudScript: 'ExecuteCloudScript',
  GetFriendsList: 'GetFriendsList',
  GetUserAccountInfo: 'GetUserAccountInfo',
  UpdateUserInternalData: 'UpdateUserInternalData',
  GetUserInternalData: 'GetUserInternalData'
};

export const GAMECHAT_ROUTES = {
  LoginAndReturnSession: 'Auth/LoginAndReturnSessionTicket',
  GetGameSessions: 'GameSessions/GetGameSessions',
  GetById: 'GameSessions/GetGameSession'
};

export const YOUTUBE_QUALITY = {
  Hight: 'hqdefault',
  Low: 'sddefault',
  Medium: 'mqdefault',
  Maximum: 'maxresdefault'
};

export const GAME_SESSION_STATUS = {
  Pending: 'Pending',
  Live: 'Live',
  Past: 'Past'
};

export const FILE_FORMAT = {
  Jpg: 'jpg',
  Pdf: 'pdf'
};

export const YOUTUBE_THUMBNAIL_URL = 'https://img.youtube.com/vi';

export const DEFAULT_PAGE_INDEX = 1;

export const EXECUTE_FUNCTIONS = {
  AddSubscriberToSendGrid: 'AddSubscriberToSendGrid',
  getProducerData: 'getProducerData',
  SubmitContactUs: 'submitContactUs',
  AddFriendRequest: 'MainSite_AddFriend',
  ResponseFriendRequest: 'MainSite_RespondToFriendRequest',
  UpdateUserConnection: 'MainSite_UpdateUserShowConnection'
};

export const USER_ROLE = {
  Guest: 'Guest',
  Producer: 'Producer'
};

export const COSMOS_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const REQUEST_DATE_FORMAT = 'YYYY-MM-DDTHH:mm Z';

export const SUBMISSION_FORM_TYPE = {
  Contact: 'contact',
  Newsletter: 'newsletter'
};

export const FRIEND_TAGS = {
  Requestee: 'requestee',
  Requestor: 'requestor',
  Friend: 'friend'
};

export const USER_STATUS = {
  Online: 0,
  Offline: -1
};
