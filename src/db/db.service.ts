import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/interfaces';
import { Artist } from 'src/artist/interfaces';
import { Track } from 'src/track/interfaces';
import { User } from 'src/user/interfaces/';
import { Favorites } from 'src/favs/interfaces/';
import { UpdatePasswordDto } from 'src/user/dto';
import { TrackDTO } from 'src/track/dto';
import { DbMessages } from 'src/common/DbMessages';
import { ArtistDTO } from 'src/artist/dto';
import { AlbumDTO } from 'src/album/dto';

@Injectable()
export class DBService {
  private users: User[] = [];
  private tracks: Track[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private favorites: Favorites[] = [];

  async getUsers() {
    return this.users;
  }

  async getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  async createUser(user: User) {
    this.users.push(user);

    return user;
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

    return track;
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

  async getArtists() {
    return this.artists;
  }

  async getArtist(artistId: string) {
    return this.artists.find((artist) => artist.id === artistId);
  }

  async createArtist(artist: Artist) {
    this.artists.push(artist);

    return artist;
  }

  async updateArtistInfo(artistId: string, dto: ArtistDTO) {
    const artist = await this.getArtist(artistId);

    if (!artist) return DbMessages.NOT_FOUND;

    artist.grammy = dto.grammy;
    artist.name = dto.name;

    return artist;
  }

  async deleteArtist(artistId: string) {
    const artist = await this.getArtist(artistId);

    if (!artist) return DbMessages.NOT_FOUND;

    this.artists = this.artists.filter((artist) => artist.id !== artistId);
  }

  async getAlbums() {
    return this.albums;
  }

  async getAlbum(albumId: string) {
    return this.albums.find((album) => album.id === albumId);
  }

  async createAlbum(album: Album) {
    this.albums.push(album);

    return album;
  }

  async updateAlbumInfo(albumId: string, dto: AlbumDTO) {
    const album = await this.getAlbum(albumId);

    if (!album) return DbMessages.NOT_FOUND;

    album.artistId = dto.artistId;
    album.name = dto.name;
    album.year = dto.year;

    return album;
  }

  async deleteAlbum(albumId: string) {
    const artist = await this.getAlbum(albumId);

    if (!artist) return DbMessages.NOT_FOUND;

    this.albums = this.albums.filter((album) => album.id !== albumId);
  }
}
