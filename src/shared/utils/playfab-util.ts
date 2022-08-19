import { EmailPreferences } from '../interfaces/user.interface';

/**
 * Get publisher obj values
 * @param dataValues
 * @returns
 */
export function getPublisherValues(dataValues) {
  const publisherData = {};
  for (const key in dataValues) {
    publisherData[key] = (dataValues[key] || {}).Value || '';
  }

  return publisherData;
}

/**
 * Get email references values
 * @param {string} emailPreferences Email references
 * @returns {EmailPreferences | null}
 */
export function getEmailPreferencesValue(emailPreferences: string = ''): EmailPreferences | null {
  if (!emailPreferences) return null;
  try {
    return JSON.parse(emailPreferences);
  } catch (err) {
    return null;
  }
}
