import { CmsUser } from 'src/cms-user/entities/cms-user.entity';
import { User } from 'src/user/entities/user.entity';
import { UserType } from './user.type';

export type CurrentUser = { userType: UserType; user: User | CmsUser };
