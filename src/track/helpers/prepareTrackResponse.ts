import { Track } from '@prisma/client';

class TrackData {
  public id: string;
  public name: string;
  public artistId: string | null;
  public albumId: string | null;
  public duration: number;

  constructor(data: Track) {
    this.id = data.id;
    this.name = data.name;
    this.artistId = data.artistId;
    this.albumId = data.albumId;
    this.duration = data.duration;
  }
}

export const prepareTrackResponse = (data: Track | Track[]) => {
  if (Array.isArray(data)) {
    return data.map((item) => new TrackData(item));
  } else {
    return new TrackData(data);
  }
};
