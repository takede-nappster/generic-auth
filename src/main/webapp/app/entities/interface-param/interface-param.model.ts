export interface IInterfaceParam {
  id?: number;
  name?: string | null;
  value?: string | null;
}

export class InterfaceParam implements IInterfaceParam {
  constructor(public id?: number, public name?: string | null, public value?: string | null) {}
}

export function getInterfaceParamIdentifier(interfaceParam: IInterfaceParam): number | undefined {
  return interfaceParam.id;
}
