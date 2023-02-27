import { join } from 'path';
import { appendFile, readdir, stat } from 'fs/promises';
import { isItemExist } from '../helpers/isItemExist';

import * as dotenv from 'dotenv';
import { createLogsFolder } from '../helpers/createLogsFolder';
import { LOGS_FOLDER_PATH } from '../constants';

dotenv.config();

export const writeLogs = async (logType: string, message: string) => {
  const maxFileSize = process.env.MAX_FILE_SIZE || 10000;

  await createLogsFolder();

  const logsFiles = await readdir(LOGS_FOLDER_PATH);

  const currentFileToWrightIdx = parseInt(
    logsFiles
      .filter((file) => file.includes(logType))
      .map((item) => item.replace(/\D/g, ''))
      .sort()
      .at(-1),
    10,
  );

  const fileName = `${logType}-${currentFileToWrightIdx || 0}.log`;

  let filePath = join(LOGS_FOLDER_PATH, fileName);
  const isFileExists = await isItemExist(filePath);

  if (isFileExists) {
    const { size } = await stat(filePath);

    if (size >= maxFileSize) {
      filePath = join(
        LOGS_FOLDER_PATH,
        `${logType}-${currentFileToWrightIdx + 1}.log`,
      );
    }
  }

  appendFile(filePath, `${message}\n`, { flag: 'a' });
};
