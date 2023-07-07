import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthInterface, getAuthInterfaceIdentifier } from '../auth-interface.model';

export type EntityResponseType = HttpResponse<IAuthInterface>;
export type EntityArrayResponseType = HttpResponse<IAuthInterface[]>;

@Injectable({ providedIn: 'root' })
export class AuthInterfaceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/auth-interfaces');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(authInterface: IAuthInterface): Observable<EntityResponseType> {
    return this.http.post<IAuthInterface>(this.resourceUrl, authInterface, { observe: 'response' });
  }

  update(authInterface: IAuthInterface): Observable<EntityResponseType> {
    return this.http.put<IAuthInterface>(`${this.resourceUrl}/${getAuthInterfaceIdentifier(authInterface) as number}`, authInterface, {
      observe: 'response',
    });
  }

  partialUpdate(authInterface: IAuthInterface): Observable<EntityResponseType> {
    return this.http.patch<IAuthInterface>(`${this.resourceUrl}/${getAuthInterfaceIdentifier(authInterface) as number}`, authInterface, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAuthInterface>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAuthInterface[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuthInterfaceToCollectionIfMissing(
    authInterfaceCollection: IAuthInterface[],
    ...authInterfacesToCheck: (IAuthInterface | null | undefined)[]
  ): IAuthInterface[] {
    const authInterfaces: IAuthInterface[] = authInterfacesToCheck.filter(isPresent);
    if (authInterfaces.length > 0) {
      const authInterfaceCollectionIdentifiers = authInterfaceCollection.map(
        authInterfaceItem => getAuthInterfaceIdentifier(authInterfaceItem)!
      );
      const authInterfacesToAdd = authInterfaces.filter(authInterfaceItem => {
        const authInterfaceIdentifier = getAuthInterfaceIdentifier(authInterfaceItem);
        if (authInterfaceIdentifier == null || authInterfaceCollectionIdentifiers.includes(authInterfaceIdentifier)) {
          return false;
        }
        authInterfaceCollectionIdentifiers.push(authInterfaceIdentifier);
        return true;
      });
      return [...authInterfacesToAdd, ...authInterfaceCollection];
    }
    return authInterfaceCollection;
  }
}
