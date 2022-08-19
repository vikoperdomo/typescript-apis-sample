import * as streamifier from 'streamifier';
import * as azure from 'azure-storage';
import { v4 as uuidV4 } from 'uuid';

import { SecretStorageInfo, UploadImageResponse } from '../shared/common/types';
import { ERROR_MESSAGE } from '../shared/common/constants';
import { AppError } from '../shared/utils/error-util';
import { HTTP_CODE } from '../shared/utils/http-response';

abstract class IUploadService {
  abstract uploadImage2Storage(subFolder: string, requestFile: any, requestHeaderContentType: string): Promise<any>;
}

export class UploadService implements IUploadService {
  constructor() {}

  /**
   *
   * @param {String} subFolder Sub folder name
   * @param {File} avatarFile avatar file
   * @returns {Object} The file name
   */
  uploadImage2Storage(subFolder: string, avatarFile: any): Promise<UploadImageResponse> {
    return new Promise((resolve, reject) => {
      try {
        const fileData: string = avatarFile.data;
        const fileName: string = subFolder + uuidV4() + avatarFile.filename;

        const { storageAccountName, storageKey, storageContainer } = this._getStorageInfo();
        const blobClient = azure.createBlobService(storageAccountName, storageKey);
        const options: object = { contentSettings: { contentType: avatarFile.type } };

        blobClient.createBlockBlobFromStream(
          storageContainer,
          fileName,
          streamifier.createReadStream(new Buffer(fileData)),
          fileData.length,
          options,
          (error, result) => {
            !error ? resolve({ fileName }) : reject(error);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get storage info
   * @returns {SecretStorageInfo} Storage info
   */
  _getStorageInfo(): SecretStorageInfo {
    const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
    const storageKey = process.env.STORAGE_KEY;
    const storageContainer = process.env.STORAGE_CONTAINER;

    if (!storageAccountName || !storageKey || !storageContainer) {
      throw new AppError(ERROR_MESSAGE.MissingAzureInfo, HTTP_CODE.Forbidden);
    }

    return { storageAccountName, storageKey, storageContainer };
  }
}
