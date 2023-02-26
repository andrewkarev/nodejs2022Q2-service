import { cwd } from 'process';
import { join } from 'path';

export const PRISMA_ERROR = 'P2025';

export const LOGS_FOLDER = 'logs';
export const LOGS_FOLDER_PATH = join(cwd(), LOGS_FOLDER);
