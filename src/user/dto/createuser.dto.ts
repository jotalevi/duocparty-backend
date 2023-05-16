import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { UserRole } from '../roles.enum';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'email must be provided',
  })
  @IsEmail(
    {},
    {
      message: 'email must be a valid mail address',
    },
  )
  @MaxLength(200, {
    message: 'the email should have no more than 200 characters',
  })
  email: string;

  @IsNotEmpty({
    message: 'name must be provided',
  })
  @MaxLength(200, {
    message: 'the name should have no more than 200 characters',
  })
  name: string;
  role: UserRole;

  password?: string;
  passwordConfirmation?: string;
}
