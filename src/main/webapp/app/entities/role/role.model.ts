import { IAuthorization } from 'app/entities/authorization/authorization.model';
import { IUserInfo } from 'app/entities/user-info/user-info.model';

export interface IRole {
  id?: number;
  name?: string | null;
  description?: string | null;
  authrizations?: IAuthorization | null;
  users?: IUserInfo[] | null;
}

export class Role implements IRole {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public authrizations?: IAuthorization | null,
    public users?: IUserInfo[] | null
  ) {}
}

export function getRoleIdentifier(role: IRole): number | undefined {
  return role.id;
}
