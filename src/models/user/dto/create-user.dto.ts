import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateUserDto {
    @ApiProperty({ name: 'email', example: 'fake@email.com' })
    @IsEmail({}, { message: CustomValidationErrors.user.email.isEmail })
    email: string;

    @ApiProperty({ name: 'fullName', example: 'fake_fullname' })
    @IsNotEmpty({ message: CustomValidationErrors.user.fullName.isNotEmpty })
    fullName: string;

    @ApiProperty({ name: 'createdBy', example: 'fake_created_by' })
    @IsNotEmpty({ message: CustomValidationErrors.user.createdBy.isNotEmpty })
    createdBy: string;
}
