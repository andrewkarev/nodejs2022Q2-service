import { access } from 'fs/promises';

export const isItemExist = async (path: string) => {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
};
