import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { generateErrorMsg } from 'src/common/helpers/generateErrorMsg';
import { IsStringOrNull } from '../../common/decorators';

export class TrackDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsStringOrNull({ message: generateErrorMsg('artistId') })
  artistId: string | null;

  @IsStringOrNull({ message: generateErrorMsg('albumId') })
  albumId: string | null;

  @IsInt()
  duration: number;
}
