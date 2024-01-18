import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateUserDto {
    @ApiProperty({ name: 'email', example: 'fake@email.com' })
    @IsEmail({}, { message: CustomValidationErrors.user.email.isEmail })
    email: string;

    @ApiProperty({ name: 'username', example: 'fake_username' })
    @IsNotEmpty({ message: CustomValidationErrors.user.username.isNotEmpty })
    username: string;

    @ApiProperty({ name: 'password', example: 'fake_password' })
    @IsNotEmpty({ message: CustomValidationErrors.user.password.isNotEmpty })
    password: string;

    @ApiProperty({ name: 'createdBy', example: 'fake_created_by' })
    @IsNotEmpty({ message: CustomValidationErrors.user.createdBy.isNotEmpty })
    createdBy: string;
}
