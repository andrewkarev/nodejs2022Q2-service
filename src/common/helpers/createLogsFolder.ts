import { mkdir } from 'fs/promises';

import { LOGS_FOLDER_PATH } from '../constants';
import { isItemExist } from './isItemExist';

export const createLogsFolder = async () => {
  const isFolderExists = await isItemExist(LOGS_FOLDER_PATH);

  if (!isFolderExists) {
    await mkdir(LOGS_FOLDER_PATH);
  }
};
