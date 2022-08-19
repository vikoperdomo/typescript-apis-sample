export interface GetSessionsBody {
  pageSize?: number;
  pageIndex?: number;
  filterOptions?: GameSessionFilterOptions;
  propertyFilter?: SearchPropertyFilter;
}

export interface SearchPropertyFilter {
  altIds?: Array<number>;
  ids?: Array<string>;
}

export interface GameSessionFilterOptions {
  searchText?: string;
  status?: string;
  genre?: string;
  timeStartedFrom?: string;
  timeStartedTo?: string;
  ignoreNoConnection?: boolean;
}

export interface SearchGameSessionsResult {
  data: Array<GameSession>;
  totalCount: number;
}

export interface ChatRoom {
  chatSectionId: number;
  uid: string;
  gridPlacement: string;
  totalActiveConnections: string;
  votes: Array<Vote>;
}

export interface Vote {
  gameSessionId: string;
  id: string;
  voteStarted: string;
  voteEnded: string;
  totalVotes: string;
  userStarted: UserStartedOrPosted;
  isVoteActive: Boolean;
  images: Array<VoteImage>;
  usersForImagesVoting: Array<any>;
}

export interface VoteImage {
  id: string;
  userPosted: UserStartedOrPosted;
}

export interface UserStartedOrPosted {
  id: string;
  email: string;
  username: string;
  avatarUri: string;
  administratingGameSession: string | null;
}

export interface ChatSession {
  id: number;
  gameSessionId: string;
  chatRooms: Array<ChatRoom>;
}

export interface GameSession {
  id: string;
  chatSections: Array<ChatSession>;
  adminAnnouncement: string;
  timeCreated: string;
  timeStarted: string | null;
  timeStopped: string | null;
  timeEnded: string | null;
  totalConnections: number;
  openedForJoining: boolean;
  userStarted: UserStartedOrPosted;
  userStartedId: number;
  superAdmins: string | null;
  superAdminsEmails: Array<string>;
  admins: string | null;
  autoApprove: boolean;
  status: string;
  googleId: string | null;
  genre: string | null;
  schedulePerformanceId: string | null;
  lastTotemQuery: string | null;
  youtubeThumbnail: string;
  streamTitle: string;
  streamDescription: string;
  streamPlatformProfileName: string;
  targetArtistDisplayName: string;
  targetArtist: TargetArtistInfo;
  altId: number;
}

export interface TargetArtistInfo {
  playFabId: string;
  displayName: string;
}

export interface Token {
  exp: number;
  nbf: number;
}

export interface SearchFields {
  timeStartedFrom?: string;
  timeStartedTo?: string;
  status?: string;
  ignoreNoConnection?: boolean;
}

export interface RequestSearchFields {
  startedFrom?: string;
  startedTo?: string;
  status?: string;
  ignoreNoConnection?: boolean;
}

export interface FilterBeforeSearch {
  ignoreNoConnection?: boolean;
}
