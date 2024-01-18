import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateUrlDto {
    @ApiProperty({ description: 'User ID', example: '1' })
    @IsNotEmpty({ message: CustomValidationErrors.url.userId.isNotEmpty })
    userId: string;

    @ApiProperty({ description: 'Original url', example: 'https://www.google.com.pe/' })
    @IsNotEmpty({ message: CustomValidationErrors.url.originalUrl.isNotEmpty })
    originalUrl: string;

    @ApiProperty({ description: 'Created by user', example: 'admin' })
    @IsNotEmpty({ message: CustomValidationErrors.url.createdBy.isNotEmpty })
    createdBy: string;
}
