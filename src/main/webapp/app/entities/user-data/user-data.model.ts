import { DataType } from 'app/entities/enumerations/data-type.model';

export interface IUserData {
  id?: number;
  fieldName?: string | null;
  fieldCode?: string | null;
  requiredStatus?: boolean | null;
  type?: DataType | null;
}

export class UserData implements IUserData {
  constructor(
    public id?: number,
    public fieldName?: string | null,
    public fieldCode?: string | null,
    public requiredStatus?: boolean | null,
    public type?: DataType | null
  ) {
    this.requiredStatus = this.requiredStatus ?? false;
  }
}

export function getUserDataIdentifier(userData: IUserData): number | undefined {
  return userData.id;
}
