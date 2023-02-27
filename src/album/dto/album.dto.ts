import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsStringOrNull } from 'src/common/decorators';
import { generateErrorMsg } from 'src/common/helpers/generateErrorMsg';

export class AlbumDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsStringOrNull({ message: generateErrorMsg('artistId') })
  artistId: string | null;
}
