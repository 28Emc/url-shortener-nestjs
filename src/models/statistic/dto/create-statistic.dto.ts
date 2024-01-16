import { IsNotEmpty } from "class-validator";
import { CustomValidationErrors } from "src/common/validations/validation-errors";

export class CreateStatisticDto {
    @IsNotEmpty({ message: CustomValidationErrors.statistic.browserInfo.isNotEmpty })
    browserInfo: string;

    @IsNotEmpty({ message: CustomValidationErrors.statistic.locationInfo.isNotEmpty })
    locationInfo: string;
}
