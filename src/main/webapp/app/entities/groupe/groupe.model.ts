import { IUserInfo } from 'app/entities/user-info/user-info.model';
import { IOrganisationService } from 'app/entities/organisation-service/organisation-service.model';

export interface IGroupe {
  id?: number;
  name?: string | null;
  descrtion?: string | null;
  members?: IUserInfo[] | null;
  services?: IOrganisationService[] | null;
}

export class Groupe implements IGroupe {
  constructor(
    public id?: number,
    public name?: string | null,
    public descrtion?: string | null,
    public members?: IUserInfo[] | null,
    public services?: IOrganisationService[] | null
  ) {}
}

export function getGroupeIdentifier(groupe: IGroupe): number | undefined {
  return groupe.id;
}
