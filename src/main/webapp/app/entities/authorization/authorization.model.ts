import { IRole } from 'app/entities/role/role.model';

export interface IAuthorization {
  id?: number;
  name?: string | null;
  description?: string | null;
  code?: string | null;
  roles?: IRole[] | null;
}

export class Authorization implements IAuthorization {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public code?: string | null,
    public roles?: IRole[] | null
  ) {}
}

export function getAuthorizationIdentifier(authorization: IAuthorization): number | undefined {
  return authorization.id;
}
