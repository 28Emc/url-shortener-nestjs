import { IsEmail, IsNotEmpty } from 'class-validator';
import { CustomValidationErrors } from 'src/common/validations/validation-errors';

export class UpdateUserDto {
    @IsEmail({}, { message: CustomValidationErrors.user.email.isEmail })
    email: string;

    @IsNotEmpty({ message: CustomValidationErrors.user.username.isNotEmpty })
    username: string;

    @IsNotEmpty({ message: CustomValidationErrors.user.modifiedBy.isNotEmpty })
    modifiedBy: string;
}
