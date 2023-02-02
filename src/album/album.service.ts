import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { prepareAlbumResponse } from '../common/helpers/prepareAlbumResponse';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { IAlbumData } from 'src/common/interfaces/IAlbumData';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAlbums(): Promise<IAlbumData | IAlbumData[]> {
    const albums = await this.prisma.album.findMany();

    return prepareAlbumResponse(albums);
  }

  async getAlbum(albumId: string): Promise<IAlbumData | IAlbumData[]> {
    const response = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!response) throw new NotFoundException();

    return prepareAlbumResponse(response);
  }

  async createAlbum(dto: AlbumDTO): Promise<IAlbumData | IAlbumData[]> {
    const album = await this.prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
        favorite: false,
      },
    });

    return prepareAlbumResponse(album);
  }

  async updateAlbumInfo(
    albumId: string,
    dto: AlbumDTO,
  ): Promise<IAlbumData | IAlbumData[]> {
    const response = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!response) throw new NotFoundException();

    const updatedArtist = await this.prisma.album.update({
      where: { id: albumId },
      data: { name: dto.name, year: dto.year, artistId: dto.artistId },
    });

    return prepareAlbumResponse(updatedArtist);
  }

  async deleteAlbum(albumId: string) {
    try {
      await this.prisma.album.delete({ where: { id: albumId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
    }
  }
}
