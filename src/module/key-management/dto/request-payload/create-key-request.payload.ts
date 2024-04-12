import { IsNotEmpty, IsInt, Min, IsDate } from 'class-validator';

export class CreateKeyRequestpayload {
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @Min(1)
  rateLimit: number;

  @IsDate()
  expirationMinutes: number;
}
