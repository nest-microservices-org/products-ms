import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}