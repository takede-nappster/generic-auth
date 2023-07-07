import { IBundle } from 'app/entities/bundle/bundle.model';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { IOrganisationService } from 'app/entities/organisation-service/organisation-service.model';
import { IAuthInterface } from 'app/entities/auth-interface/auth-interface.model';

export interface IOrganisation {
  id?: number;
  name?: string | null;
  description?: string | null;
  email?: string | null;
  password?: string | null;
  token?: string | null;
  subscriptions?: IBundle | null;
  userdatas?: IUserData | null;
  services?: IOrganisationService[] | null;
  interfaces?: IAuthInterface[] | null;
}

export class Organisation implements IOrganisation {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public email?: string | null,
    public password?: string | null,
    public token?: string | null,
    public subscriptions?: IBundle | null,
    public userdatas?: IUserData | null,
    public services?: IOrganisationService[] | null,
    public interfaces?: IAuthInterface[] | null
  ) {}
}

export function getOrganisationIdentifier(organisation: IOrganisation): number | undefined {
  return organisation.id;
}
