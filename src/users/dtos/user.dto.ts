import { Expose } from 'class-transformer';

export class USerDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
}
