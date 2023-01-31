import { Injectable, NotFoundException } from '@nestjs/common';
import { DbMessages } from 'src/common/DbMessages';
import { DBService } from 'src/db/db.service';
import { v4 as uuid4 } from 'uuid';
import { ArtistDTO } from './dto';

@Injectable()
export class ArtistService {
  constructor(private db: DBService) {}

  async getArtists() {
    return await this.db.getArtists();
  }

  async getArtist(artistId: string) {
    const response = await this.db.getArtist(artistId);

    if (!response) throw new NotFoundException();

    return response;
  }

  async createArtist(dto: ArtistDTO) {
    const artist = { ...dto, id: uuid4() };

    return await this.db.createArtist(artist);
  }

  async updateArtistInfo(artistId: string, dto: ArtistDTO) {
    const response = await this.db.updateArtistInfo(artistId, dto);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }

  async deleteArtist(artistId: string) {
    const response = await this.db.deleteArtist(artistId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }
}
