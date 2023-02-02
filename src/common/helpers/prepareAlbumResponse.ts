import { Album } from '@prisma/client';
import { IAlbumData } from '../interfaces/IAlbumData';

class AlbumData implements IAlbumData {
  public id: string;
  public name: string;
  public year: number;
  public artistId: string | null;

  constructor(data: Album) {
    this.id = data.id;
    this.name = data.name;
    this.year = data.year;
    this.artistId = data.artistId;
  }
}

export const prepareAlbumResponse = (data: Album | Album[]) => {
  if (Array.isArray(data)) {
    return data.map((item) => new AlbumData(item));
  } else {
    return new AlbumData(data);
  }
};
