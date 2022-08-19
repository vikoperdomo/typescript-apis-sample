import * as Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  userName: Joi.string().required(),
  displayName: Joi.string().required(),
  customTags: Joi.object({
    account_type: Joi.string().required()
  }).required(),
  pronoun: Joi.string(),
  birthday: Joi.date().raw().required(),
  genre: Joi.string(),
  marketingOptIn: Joi.boolean()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  pronoun: Joi.string(),
  genre: Joi.string(),
  marketingOptIn: Joi.boolean()
});

export const editPlaylistSchema = Joi.object({
  sessionId: Joi.string().required()
});

export const addFriendRequestSchema = Joi.object({
  friendIds: Joi.array().items(Joi.string()).required()
});

export const responseFriendRequestSchema = Joi.object({
  friendId: Joi.string().required(),
  displayName: Joi.string().required(),
  isAccept: Joi.boolean().required()
});

export const updateUserConnection = Joi.object({
  showId: Joi.string().required(),
  disconnect: Joi.boolean().required()
});
