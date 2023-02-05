import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { DbMessages } from 'src/common/DbMessages';
import { DBService } from 'src/db/db.service';
import { AlbumDTO } from './dto';

@Injectable()
export class AlbumService {
  constructor(private db: DBService) {}

  async getAlbums() {
    return await this.db.getAlbums();
  }

  async getAlbum(albumId: string) {
    const response = await this.db.getAlbum(albumId);

    if (!response) throw new NotFoundException();

    return response;
  }

  async createAlbum(dto: AlbumDTO) {
    const album = { ...dto, id: uuid4() };

    return await this.db.createAlbum(album);
  }

  async updateAlbumInfo(albumId: string, dto: AlbumDTO) {
    const response = await this.db.updateAlbumInfo(albumId, dto);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }

  async deleteAlbum(albumId: string) {
    const response = await this.db.deleteAlbum(albumId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }
}
