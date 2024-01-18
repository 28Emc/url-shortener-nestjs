import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class UpdateStatusUserDto {
    @ApiProperty({ name: 'modifiedBy', example: 'fake_modified_by' })
    @IsNotEmpty({ message: CustomValidationErrors.user.modifiedBy.isNotEmpty })
    modifiedBy: string;
}
