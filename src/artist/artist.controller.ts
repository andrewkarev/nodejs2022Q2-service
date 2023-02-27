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
import { ArtistService } from './artist.service';
import { ArtistDTO } from './dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  getArtists() {
    return this.artistService.getArtists();
  }

  @Get(':id')
  getArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.getArtist(id);
  }

  @Post()
  createArtist(@Body(ValidationPipe) dto: ArtistDTO) {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
  updateArtistInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: ArtistDTO,
  ) {
    return this.artistService.updateArtistInfo(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.deleteArtist(id);
  }
}
