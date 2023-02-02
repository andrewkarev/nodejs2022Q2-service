import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistDTO } from './dto';
import { prepareArtistResponse } from '../common/helpers/prepareArtistResponse';
import { IArtistData } from 'src/common/interfaces/IArtistData';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getArtists(): Promise<IArtistData | IArtistData[]> {
    const artists = await this.prisma.artist.findMany();

    return prepareArtistResponse(artists);
  }

  async getArtist(artistId: string): Promise<IArtistData | IArtistData[]> {
    const response = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!response) throw new NotFoundException();

    return prepareArtistResponse(response);
  }

  async createArtist(dto: ArtistDTO): Promise<IArtistData | IArtistData[]> {
    const artist = await this.prisma.artist.create({
      data: {
        name: dto.name,
        grammy: dto.grammy,
        favorite: false,
      },
    });

    return prepareArtistResponse(artist);
  }

  async updateArtistInfo(
    artistId: string,
    dto: ArtistDTO,
  ): Promise<IArtistData | IArtistData[]> {
    const response = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!response) throw new NotFoundException();

    const updatedArtist = await this.prisma.artist.update({
      where: { id: artistId },
      data: { name: dto.name, grammy: dto.grammy },
    });

    return prepareArtistResponse(updatedArtist);
  }

  async deleteArtist(artistId: string) {
    try {
      await this.prisma.artist.delete({ where: { id: artistId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
    }
  }
}
