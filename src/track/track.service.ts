import { Injectable, NotFoundException } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { TrackDTO } from './dto';
import { v4 as uuid4 } from 'uuid';
import { DbMessages } from 'src/common/DbMessages';

@Injectable()
export class TrackService {
  constructor(private db: DBService) {}

  async getTracks() {
    return await this.db.getTracks();
  }

  async getTrack(trackId: string) {
    const response = await this.db.getTrack(trackId);

    if (!response) throw new NotFoundException();

    return response;
  }

  async createTrack(dto: TrackDTO) {
    const track = { ...dto, id: uuid4() };

    return await this.db.createTrack(track);
  }

  async updateTrackInfo(trackId: string, dto: TrackDTO) {
    const response = await this.db.updateTrackInfo(trackId, dto);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }

  async deleteTrack(trackId: string) {
    const response = await this.db.deleteTrack(trackId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();

    return response;
  }
}
