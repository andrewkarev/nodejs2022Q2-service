import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/interfaces';
import { Artist } from 'src/artist/interfaces';
import { Track } from 'src/track/interfaces';
import { User } from 'src/user/interfaces/';
import { Favorites } from 'src/favs/interfaces/';
import { UpdatePasswordDto } from 'src/user/dto';
import { TrackDTO } from 'src/track/dto';
import { DbMessages } from 'src/common/DbMessages';

@Injectable()
export class DBService {
  private users: User[] = [];
  private tracks: Track[] = [];
  private artists: Artist[] = [];
  private album: Album[] = [];
  private favorites: Favorites[] = [];

  async getUsers() {
    return this.users;
  }

  async getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  async createUser(user: User) {
    this.users.push(user);

    return this.users.at(-1);
  }

  async updateUserPassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.getUser(userId);

    if (!user) return DbMessages.NOT_FOUND;
    if (user.password !== dto.oldPassword) return DbMessages.FORBIDDEN;

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.getUser(userId);

    if (!user) return DbMessages.NOT_FOUND;

    this.users = this.users.filter((user) => user.id !== userId);
  }

  async getTracks() {
    return this.tracks;
  }

  async getTrack(trackId: string) {
    return this.tracks.find((track) => track.id === trackId);
  }

  async createTrack(track: Track) {
    this.tracks.push(track);

    return this.tracks.at(-1);
  }

  async updateTrackInfo(trackId: string, dto: TrackDTO) {
    const track = await this.getTrack(trackId);

    if (!track) return DbMessages.NOT_FOUND;

    track.name = dto.name;
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return track;
  }

  async deleteTrack(trackId: string) {
    const track = await this.getTrack(trackId);

    if (!track) return DbMessages.NOT_FOUND;

    this.tracks = this.tracks.filter((track) => track.id !== trackId);
  }
}
