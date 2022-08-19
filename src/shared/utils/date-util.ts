import * as moment from 'moment';
import { COSMOS_DATE_FORMAT, REQUEST_DATE_FORMAT } from '../common/constants';

export class DateUtil {
  /**
   *
   * @param date
   * @param format
   * @returns
   */
  static isValidDate(date, format) {
    const dateMoment = moment(date, format, true);
    return dateMoment.isValid();
  }

  /**
   *
   * @param dateString
   * @param format
   * @returns
   */
  static convertStrToMoment(dateString, format) {
    return moment(dateString, format).utc();
  }

  /**
   *
   * @param dateOrigin
   * @param dateCompare
   * @param granularity
   * @returns
   */
  static isBefore(dateOrigin, dateCompare, format) {
    return moment(dateOrigin, format).isBefore(dateCompare);
  }

  /**
   *
   * @param date
   * @param formatType
   * @returns
   */
  static format(date: string | number, formatType: string) {
    return moment(date).format(formatType);
  }

  /**
   * Get current date time
   * @param {string} formatType Expected datetime format
   * @returns
   */
  static currentDate(formatType: string = '') {
    return formatType ? moment().utc().format(formatType) : moment().utc();
  }

  /**
   * Convert date time to timestamp
   * @param {String} dateTime The date time
   * @returns {Number} Timestamp
   */
  static convertToTimeStamp(dateTime: string) {
    return Date.parse(dateTime) / 1000;
  }

  /**
   * Convert string time to utc time
   * @param {string} dateTime
   * @returns {string} The date time formatted
   */
  static convertToUTC(dateTime: string, srcFormat: string = REQUEST_DATE_FORMAT, desFormat: string = COSMOS_DATE_FORMAT): string {
    return moment(dateTime, srcFormat).utc().format(desFormat);
  }
}
