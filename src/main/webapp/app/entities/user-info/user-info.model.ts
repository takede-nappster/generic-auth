import dayjs from 'dayjs/esm';
import { IRole } from 'app/entities/role/role.model';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { IAdditionalData } from 'app/entities/additional-data/additional-data.model';
import { ISession } from 'app/entities/session/session.model';
import { IOrganisationService } from 'app/entities/organisation-service/organisation-service.model';
import { UserType } from 'app/entities/enumerations/user-type.model';

export interface IUserInfo {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imagebiometric?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
  userType?: UserType | null;
  roles?: IRole | null;
  groupes?: IGroupe | null;
  additionalDatas?: IAdditionalData[] | null;
  sessions?: ISession[] | null;
  services?: IOrganisationService[] | null;
}

export class UserInfo implements IUserInfo {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public username?: string | null,
    public imagebiometric?: string | null,
    public dateOfBirth?: dayjs.Dayjs | null,
    public userType?: UserType | null,
    public roles?: IRole | null,
    public groupes?: IGroupe | null,
    public additionalDatas?: IAdditionalData[] | null,
    public sessions?: ISession[] | null,
    public services?: IOrganisationService[] | null
  ) {}
}

export function getUserInfoIdentifier(userInfo: IUserInfo): number | undefined {
  return userInfo.id;
}
