import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CustomValidationErrors } from 'src/common/validations/validation-errors';

export class UpdateUrlCountsDto {
    @ApiProperty({ description: 'Url UUID', example: 'sg26svas' })
    @IsNotEmpty({ message: CustomValidationErrors.url.uuid.isNotEmpty })
    uuid: string;

    @ApiProperty({ description: 'Url click nro', example: 2 })
    @IsNumber({}, { message: CustomValidationErrors.url.clickNro.isNumber })
    @IsPositive({ message: CustomValidationErrors.url.clickNro.isPositive })
    clickNro: number;
}
