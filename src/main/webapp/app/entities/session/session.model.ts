import dayjs from 'dayjs/esm';
import { IUserInfo } from 'app/entities/user-info/user-info.model';

export interface ISession {
  id?: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  sessions?: IUserInfo[] | null;
}

export class Session implements ISession {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public sessions?: IUserInfo[] | null
  ) {}
}

export function getSessionIdentifier(session: ISession): number | undefined {
  return session.id;
}
