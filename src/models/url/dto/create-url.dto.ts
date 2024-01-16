import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateUrlDto {
    @IsNotEmpty({ message: CustomValidationErrors.url.userId.isNotEmpty })
    userId: string;

    @IsNotEmpty({ message: CustomValidationErrors.url.originalUrl.isNotEmpty })
    originalUrl: string;

    @IsNotEmpty({ message: CustomValidationErrors.url.createdBy.isNotEmpty })
    createdBy: string;
}
