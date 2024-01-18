import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateStatisticDto {
    @ApiProperty({ description: 'Url ID', example: '1' })
    @IsNotEmpty({ message: CustomValidationErrors.statistic.urlId.isNotEmpty })
    urlId: string;

    @ApiProperty({ description: 'Browser info', example: 'Mozilla...' })
    @IsNotEmpty({ message: CustomValidationErrors.statistic.browserInfo.isNotEmpty })
    browserInfo: string;

    @ApiProperty({ description: 'Location info', example: 'Lima | Perú' })
    @IsNotEmpty({ message: CustomValidationErrors.statistic.locationInfo.isNotEmpty })
    locationInfo: string;
}
