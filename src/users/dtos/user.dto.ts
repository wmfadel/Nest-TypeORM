import { Expose } from 'class-transformer';

// This is the DTO that will be serialized, 
// exposing only the id and email fields, the values we want to send back to the client
export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
}
