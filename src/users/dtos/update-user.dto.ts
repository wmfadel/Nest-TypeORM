import { IsEmail, IsOptional, IsString } from 'class-validator';

// DTO for updating a user entity marking fields with @IsOptional()
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  password: string;
}
