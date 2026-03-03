export class CreateUserDto {
  iin: string;
  email: string;
  phone_number?: string;
  password: string;
  c1_guid?: string;
}
