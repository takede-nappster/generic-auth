import dayjs from 'dayjs/esm';

export interface IBundle {
  id?: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
}

export class Bundle implements IBundle {
  constructor(public id?: number, public startDate?: dayjs.Dayjs | null, public endDate?: dayjs.Dayjs | null) {}
}

export function getBundleIdentifier(bundle: IBundle): number | undefined {
  return bundle.id;
}
