import { google } from 'googleapis';
import { AppError } from '../shared/utils/error-util';
import { ERROR_MESSAGE, SHEET_RANGE_DEFAULT } from '../shared/common/constants';
import { HTTP_CODE } from '../shared/utils/http-response';

export class GoogleService {
  private auth;
  private googleSheets;
  constructor() {}

  /**
   *
   * @returns
   */
  async getMetaData() {
    const ID: string = process.env.SPREADSHEET_ID;
    await this.authorize();
    const metaData = await this.googleSheets.spreadsheets.get({
      auth: this.auth,
      spreadsheetId: ID,
      range: 'Sheet1'
    });

    return metaData.data;
  }

  /**
   * Authorize google credentials
   */
  async authorize(): Promise<void> {
    this.auth = new google.auth.GoogleAuth({
      keyFile: `./credentials.${process.env.NODE_ENV || 'dev'}.json`,
      scopes: 'https://www.googleapis.com/auth/spreadsheets'
    });

    const client = await this.auth.getClient();
    this.googleSheets = google.sheets({ version: 'v4', auth: client });
  }

  /**
   *
   * @param data
   * @returns
   */
  async addDataToSheet(rowsData: Array<Array<string | number | boolean>>, sheetRange: string = SHEET_RANGE_DEFAULT): Promise<boolean> {
    const sheetId: string = process.env.SPREADSHEET_ID;
    if (!sheetId) {
      throw new AppError(ERROR_MESSAGE.SheetIdNotExists, HTTP_CODE.Forbidden);
    }

    await this.authorize();
    try {
      await this.googleSheets.spreadsheets.values.append({
        auth: this.auth,
        spreadsheetId: sheetId,
        range: sheetRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: rowsData
        }
      });

      return true;
    } catch (err) {
      throw new AppError(err.message, err.status);
    }
  }
}
