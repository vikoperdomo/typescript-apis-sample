export const mapperRequestToModel = {
  Email: 'email',
  Password: 'password',
  Username: 'userName',
  DisplayName: 'displayName',
  CustomTags: 'customTags'
};

export const mapperRequestToCosmosModel = {
  id: 'userId',
  email: 'email',
  playfab_id: 'playFabId',
  marketing_opt_in: 'marketingOptIn'
};

export const mapperCosmosModelToResponse = {
  userId: 'id',
  email: 'email',
  playFabId: 'playfab_id',
  marketingOptIn: 'marketing_opt_in'
};

export const mapperPlayFabFriendsToResponse = {
  friendId: 'FriendPlayFabId',
  username: 'Username',
  displayName: 'TitleDisplayName',
  avatarUrl: (iteratee, source, destination) => iteratee?.Profile?.AvatarUrl || '',
  activeShowId: 'ActiveShowId'
};
