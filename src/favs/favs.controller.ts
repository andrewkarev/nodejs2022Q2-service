import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private favsService: FavsService) {}

  @Get()
  getAlbums() {
    return this.favsService.getFavorites();
  }

  @Post('track/:id')
  addFavTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addFavTrack(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('track/:id')
  deleteFavTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteFavTrack(id);
  }

  @Post('album/:id')
  addFavAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addFavAlbum(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('album/:id')
  deleteFavAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteFavAlbum(id);
  }

  @Post('artist/:id')
  addFavArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addFavArtist(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('artist/:id')
  deleteFavArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteFavArtist(id);
  }
}
