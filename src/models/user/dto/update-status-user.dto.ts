import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class UpdateStatusUserDto {
    @IsNotEmpty({ message: CustomValidationErrors.user.modifiedBy.isNotEmpty })
    modifiedBy: string;
}
