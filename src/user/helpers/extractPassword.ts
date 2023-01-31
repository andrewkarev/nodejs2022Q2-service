import { User } from '../interfaces';

export const extractPassword = (data: User | User[]) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const itemCopy = { ...item };
      delete itemCopy.password;

      return itemCopy;
    });
  } else {
    const dataCopy = { ...data };
    delete dataCopy.password;

    return dataCopy;
  }
};
