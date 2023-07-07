import { IUserInfo } from 'app/entities/user-info/user-info.model';

export interface IAdditionalData {
  id?: number;
  fieldCode?: string | null;
  value?: string | null;
  users?: IUserInfo[] | null;
}

export class AdditionalData implements IAdditionalData {
  constructor(public id?: number, public fieldCode?: string | null, public value?: string | null, public users?: IUserInfo[] | null) {}
}

export function getAdditionalDataIdentifier(additionalData: IAdditionalData): number | undefined {
  return additionalData.id;
}
