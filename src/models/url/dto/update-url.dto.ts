import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CustomValidationErrors } from 'src/common/validations/validation-errors';

export class UpdateUrlDto {
    @ApiHideProperty()
    @IsNotEmpty({ message: CustomValidationErrors.url.userUUID.isNotEmpty })
    userUUID: string;

    @ApiHideProperty()
    @IsNotEmpty({ message: CustomValidationErrors.url.originalUrl.isNotEmpty })
    originalUrl: string;

    @ApiHideProperty()
    @IsNotEmpty({ message: CustomValidationErrors.url.shortUrl.isNotEmpty })
    shortUrl: string;
}
