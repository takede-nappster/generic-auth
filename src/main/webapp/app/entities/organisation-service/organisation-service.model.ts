import { IUserInfo } from 'app/entities/user-info/user-info.model';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { IOrganisation } from 'app/entities/organisation/organisation.model';

export interface IOrganisationService {
  id?: number;
  name?: string | null;
  description?: string | null;
  members?: IUserInfo[] | null;
  groups?: IGroupe[] | null;
  organisations?: IOrganisation[] | null;
}

export class OrganisationService implements IOrganisationService {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public members?: IUserInfo[] | null,
    public groups?: IGroupe[] | null,
    public organisations?: IOrganisation[] | null
  ) {}
}

export function getOrganisationServiceIdentifier(organisationService: IOrganisationService): number | undefined {
  return organisationService.id;
}
