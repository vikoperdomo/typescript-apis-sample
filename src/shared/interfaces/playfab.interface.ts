export interface SubmissionFormData {
  name?: string;
  message?: string;
  email: string;
}

export interface GetFirebaseUserRequest {
  CustomTags?: any;
  IncludeFacebookFriends?: boolean;
  IncludeSteamFriends?: boolean;
  ProfileConstraints?: PlayerProfile;
}

export interface PlayerProfile {
  ShowAvatarUrl: boolean;
  ShowStatistics: boolean;
}

export interface UpdateConnectionBody {
  showId: string | number;
  disconnect: boolean;
}

export interface UserInternalData {
  scheduledPerformances: string;
}

export interface UpdateInternalDataBody {
  PlayFabId: string;
  Data: UserInternalData;
}

export interface PlayfabRequestOptions {
  headers: {
    'X-SecretKey'?: string;
    'X-Authorization'?: string;
  };
}
