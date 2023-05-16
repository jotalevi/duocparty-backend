import { User } from '../user.entity';

export class ReturnUserListDto {
  count?: number;
  items?: User[];
}
