import { IsOptional, IsInt, Min, IsDate } from 'class-validator';

export class UpdateKeyRequestPayload {
  @IsOptional()
  @IsInt()
  @Min(1)
  rateLimit?: number;

  @IsOptional()
  @IsDate()
  expirationMinutes?: number;
}
