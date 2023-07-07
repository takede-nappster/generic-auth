import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthorization, getAuthorizationIdentifier } from '../authorization.model';

export type EntityResponseType = HttpResponse<IAuthorization>;
export type EntityArrayResponseType = HttpResponse<IAuthorization[]>;

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/authorizations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(authorization: IAuthorization): Observable<EntityResponseType> {
    return this.http.post<IAuthorization>(this.resourceUrl, authorization, { observe: 'response' });
  }

  update(authorization: IAuthorization): Observable<EntityResponseType> {
    return this.http.put<IAuthorization>(`${this.resourceUrl}/${getAuthorizationIdentifier(authorization) as number}`, authorization, {
      observe: 'response',
    });
  }

  partialUpdate(authorization: IAuthorization): Observable<EntityResponseType> {
    return this.http.patch<IAuthorization>(`${this.resourceUrl}/${getAuthorizationIdentifier(authorization) as number}`, authorization, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAuthorization>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAuthorization[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuthorizationToCollectionIfMissing(
    authorizationCollection: IAuthorization[],
    ...authorizationsToCheck: (IAuthorization | null | undefined)[]
  ): IAuthorization[] {
    const authorizations: IAuthorization[] = authorizationsToCheck.filter(isPresent);
    if (authorizations.length > 0) {
      const authorizationCollectionIdentifiers = authorizationCollection.map(
        authorizationItem => getAuthorizationIdentifier(authorizationItem)!
      );
      const authorizationsToAdd = authorizations.filter(authorizationItem => {
        const authorizationIdentifier = getAuthorizationIdentifier(authorizationItem);
        if (authorizationIdentifier == null || authorizationCollectionIdentifiers.includes(authorizationIdentifier)) {
          return false;
        }
        authorizationCollectionIdentifiers.push(authorizationIdentifier);
        return true;
      });
      return [...authorizationsToAdd, ...authorizationCollection];
    }
    return authorizationCollection;
  }
}
