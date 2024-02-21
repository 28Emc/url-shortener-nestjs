import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseErrorDto {
    @ApiProperty({ description: 'Response message', example: 'There was an error' })
    message: string;

    @ApiProperty({ description: 'Response error detail payload (or error detail list)', example: [] })
    detail: [];
}

export class ApiResponseListDto<T> {
    @ApiProperty({ description: 'Response message', example: 'Ok' })
    message: string;

    @ApiProperty({ description: 'Response list payload', example: [] })
    detail: T[];
}

export class ApiResponseObjectDto<T> {
    @ApiProperty({ description: 'Response message', example: 'Ok' })
    message: string;

    @ApiProperty({ description: 'Response object payload', example: {} })
    detail: T;
}