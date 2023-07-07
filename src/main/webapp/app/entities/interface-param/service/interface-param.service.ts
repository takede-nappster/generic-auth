import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInterfaceParam, getInterfaceParamIdentifier } from '../interface-param.model';

export type EntityResponseType = HttpResponse<IInterfaceParam>;
export type EntityArrayResponseType = HttpResponse<IInterfaceParam[]>;

@Injectable({ providedIn: 'root' })
export class InterfaceParamService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/interface-params');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(interfaceParam: IInterfaceParam): Observable<EntityResponseType> {
    return this.http.post<IInterfaceParam>(this.resourceUrl, interfaceParam, { observe: 'response' });
  }

  update(interfaceParam: IInterfaceParam): Observable<EntityResponseType> {
    return this.http.put<IInterfaceParam>(`${this.resourceUrl}/${getInterfaceParamIdentifier(interfaceParam) as number}`, interfaceParam, {
      observe: 'response',
    });
  }

  partialUpdate(interfaceParam: IInterfaceParam): Observable<EntityResponseType> {
    return this.http.patch<IInterfaceParam>(
      `${this.resourceUrl}/${getInterfaceParamIdentifier(interfaceParam) as number}`,
      interfaceParam,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInterfaceParam>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInterfaceParam[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInterfaceParamToCollectionIfMissing(
    interfaceParamCollection: IInterfaceParam[],
    ...interfaceParamsToCheck: (IInterfaceParam | null | undefined)[]
  ): IInterfaceParam[] {
    const interfaceParams: IInterfaceParam[] = interfaceParamsToCheck.filter(isPresent);
    if (interfaceParams.length > 0) {
      const interfaceParamCollectionIdentifiers = interfaceParamCollection.map(
        interfaceParamItem => getInterfaceParamIdentifier(interfaceParamItem)!
      );
      const interfaceParamsToAdd = interfaceParams.filter(interfaceParamItem => {
        const interfaceParamIdentifier = getInterfaceParamIdentifier(interfaceParamItem);
        if (interfaceParamIdentifier == null || interfaceParamCollectionIdentifiers.includes(interfaceParamIdentifier)) {
          return false;
        }
        interfaceParamCollectionIdentifiers.push(interfaceParamIdentifier);
        return true;
      });
      return [...interfaceParamsToAdd, ...interfaceParamCollection];
    }
    return interfaceParamCollection;
  }
}
