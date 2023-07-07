import { IInterfaceParam } from 'app/entities/interface-param/interface-param.model';
import { IOrganisation } from 'app/entities/organisation/organisation.model';

export interface IAuthInterface {
  id?: number;
  name?: string | null;
  description?: string | null;
  url?: string | null;
  driverName?: string | null;
  prams?: IInterfaceParam | null;
  organisations?: IOrganisation[] | null;
}

export class AuthInterface implements IAuthInterface {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public url?: string | null,
    public driverName?: string | null,
    public prams?: IInterfaceParam | null,
    public organisations?: IOrganisation[] | null
  ) {}
}

export function getAuthInterfaceIdentifier(authInterface: IAuthInterface): number | undefined {
  return authInterface.id;
}
