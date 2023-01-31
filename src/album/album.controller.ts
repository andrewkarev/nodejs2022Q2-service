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
import { AlbumService } from './album.service';
import { AlbumDTO } from './dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAlbums() {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  getAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.getAlbum(id);
  }

  @Post()
  createAlbum(@Body(ValidationPipe) dto: AlbumDTO) {
    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  updateAlbumInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: AlbumDTO,
  ) {
    return this.albumService.updateAlbumInfo(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.deleteAlbum(id);
  }
}
