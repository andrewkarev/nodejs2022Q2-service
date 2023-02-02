import { Artist } from '@prisma/client';

class ArtistData {
  public id: string;
  public name: string;
  public grammy: boolean;

  constructor(data: Artist) {
    this.id = data.id;
    this.name = data.name;
    this.grammy = data.grammy;
  }
}

export const prepareArtistResponse = (data: Artist | Artist[]) => {
  if (Array.isArray(data)) {
    return data.map((item) => new ArtistData(item));
  } else {
    return new ArtistData(data);
  }
};
