import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prepareAlbumResponse } from 'src/common/helpers/prepareAlbumResponse';
import { prepareArtistResponse } from 'src/common/helpers/prepareArtistResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { prepareTrackResponse } from 'src/common/helpers/prepareTrackResponse';
import { ITrackData } from 'src/common/interfaces/ITrackData';
import { IAlbumData } from 'src/common/interfaces/IAlbumData';
import { IArtistData } from 'src/common/interfaces/IArtistData';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(): Promise<{
    artists: IArtistData | IArtistData[];
    albums: IAlbumData | IAlbumData[];
    tracks: ITrackData | ITrackData[];
  }> {
    const artists = await this.prisma.artist.findMany({
      where: { favorite: true },
    });
    const albums = await this.prisma.album.findMany({
      where: { favorite: true },
    });
    const tracks = await this.prisma.track.findMany({
      where: { favorite: true },
    });

    return {
      artists: prepareArtistResponse(artists),
      albums: prepareAlbumResponse(albums),
      tracks: prepareTrackResponse(tracks),
    };
  }

  async addFavTrack(trackId: string): Promise<ITrackData | ITrackData[]> {
    try {
      const response = await this.prisma.track.update({
        where: { id: trackId },
        data: { favorite: true },
      });

      return prepareTrackResponse(response);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new UnprocessableEntityException();
        }
      }
    }
  }

  async deleteFavTrack(trackId: string) {
    try {
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favorite: false },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
    }
  }

  async addFavAlbum(albumId: string): Promise<IAlbumData | IAlbumData[]> {
    try {
      const response = await this.prisma.album.update({
        where: { id: albumId },
        data: { favorite: true },
      });

      return prepareAlbumResponse(response);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new UnprocessableEntityException();
        }
      }
    }
  }

  async deleteFavAlbum(albumId: string) {
    try {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favorite: false },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
    }
  }

  async addFavArtist(artistId: string): Promise<IArtistData | IArtistData[]> {
    try {
      const response = await this.prisma.artist.update({
        where: { id: artistId },
        data: { favorite: true },
      });

      return prepareArtistResponse(response);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new UnprocessableEntityException();
        }
      }
    }
  }

  async deleteFavArtist(artistId: string) {
    try {
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favorite: false },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
    }
  }
}
