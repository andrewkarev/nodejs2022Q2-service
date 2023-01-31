import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { TrackDTO } from './dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  getTracks() {
    return this.trackService.getTracks();
  }

  @Get(':id')
  getTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.getTrack(id);
  }

  @Post()
  createTrack(@Body(ValidationPipe) dto: TrackDTO) {
    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  updateTrackInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: TrackDTO,
  ) {
    return this.trackService.updateTrackInfo(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.deleteTrack(id);
  }
}
