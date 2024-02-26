import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateUrlDto {
    @ApiProperty({ description: 'User UUID', example: 'fake_user_uuid' })
    @IsNotEmpty({ message: CustomValidationErrors.url.userUUID.isNotEmpty })
    userUUID: string;

    @ApiProperty({ description: 'Original url', example: 'https://www.google.com.pe/' })
    @IsNotEmpty({ message: CustomValidationErrors.url.originalUrl.isNotEmpty })
    originalUrl: string;

    @ApiProperty({ description: 'Created by user', example: 'admin' })
    @IsNotEmpty({ message: CustomValidationErrors.url.createdBy.isNotEmpty })
    createdBy: string;
}
