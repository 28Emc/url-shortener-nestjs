import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CustomValidationErrors } from 'src/common/validations/validation-errors';

export class UpdateUrlCountsDto {
    @IsNotEmpty({ message: CustomValidationErrors.url.uuid.isNotEmpty })
    uuid: string;

    @IsNumber({}, { message: CustomValidationErrors.url.clickNro.isNumber })
    @IsPositive({ message: CustomValidationErrors.url.clickNro.isPositive })
    clickNro: number;
}
