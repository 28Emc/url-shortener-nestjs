import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseErrorDto {
    @ApiProperty({ description: 'Response message', example: 'Data found' })
    message: string;

    @ApiProperty({ description: 'Response error detail payload (or error detail list)' })
    details: [];
}

export class ApiResponseListDto<T> {
    @ApiProperty({ description: 'Response message', example: 'Data found' })
    message: string;

    @ApiProperty({ description: 'Response list payload' })
    details: T[];
}

export class ApiResponseObjectDto<T> {
    @ApiProperty({ description: 'Response message', example: 'Data found' })
    message: string;

    @ApiProperty({ description: 'Response object payload' })
    details: T;
}