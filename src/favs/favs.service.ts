import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DbMessages } from 'src/common/DbMessages';
import { DBService } from 'src/db/db.service';

@Injectable()
export class FavsService {
  constructor(private db: DBService) {}

  async getFavorites() {
    return this.db.getFavorites();
  }

  async addFavTrack(trackId: string) {
    const response = await this.db.addFavTrack(trackId);

    if (response === DbMessages.NOT_FOUND) {
      throw new UnprocessableEntityException();
    }

    return response;
  }

  async deleteFavTrack(trackId: string) {
    const response = await this.db.deleteFavTrack(trackId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }

  async addFavAlbum(albumId: string) {
    const response = await this.db.addFavAlbum(albumId);

    if (response === DbMessages.NOT_FOUND) {
      throw new UnprocessableEntityException();
    }

    return response;
  }

  async deleteFavAlbum(albumId: string) {
    const response = await this.db.deleteFavAlbum(albumId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }

  async addFavArtist(artistId: string) {
    const response = await this.db.addFavArtist(artistId);

    if (response === DbMessages.NOT_FOUND) {
      throw new UnprocessableEntityException();
    }

    return response;
  }

  async deleteFavArtist(artistId: string) {
    const response = await this.db.deleteFavArtist(artistId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }
}
