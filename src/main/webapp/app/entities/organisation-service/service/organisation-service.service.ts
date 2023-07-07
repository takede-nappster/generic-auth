import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganisationService, getOrganisationServiceIdentifier } from '../organisation-service.model';

export type EntityResponseType = HttpResponse<IOrganisationService>;
export type EntityArrayResponseType = HttpResponse<IOrganisationService[]>;

@Injectable({ providedIn: 'root' })
export class OrganisationServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organisation-services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organisationService: IOrganisationService): Observable<EntityResponseType> {
    return this.http.post<IOrganisationService>(this.resourceUrl, organisationService, { observe: 'response' });
  }

  update(organisationService: IOrganisationService): Observable<EntityResponseType> {
    return this.http.put<IOrganisationService>(
      `${this.resourceUrl}/${getOrganisationServiceIdentifier(organisationService) as number}`,
      organisationService,
      { observe: 'response' }
    );
  }

  partialUpdate(organisationService: IOrganisationService): Observable<EntityResponseType> {
    return this.http.patch<IOrganisationService>(
      `${this.resourceUrl}/${getOrganisationServiceIdentifier(organisationService) as number}`,
      organisationService,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrganisationService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrganisationService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganisationServiceToCollectionIfMissing(
    organisationServiceCollection: IOrganisationService[],
    ...organisationServicesToCheck: (IOrganisationService | null | undefined)[]
  ): IOrganisationService[] {
    const organisationServices: IOrganisationService[] = organisationServicesToCheck.filter(isPresent);
    if (organisationServices.length > 0) {
      const organisationServiceCollectionIdentifiers = organisationServiceCollection.map(
        organisationServiceItem => getOrganisationServiceIdentifier(organisationServiceItem)!
      );
      const organisationServicesToAdd = organisationServices.filter(organisationServiceItem => {
        const organisationServiceIdentifier = getOrganisationServiceIdentifier(organisationServiceItem);
        if (organisationServiceIdentifier == null || organisationServiceCollectionIdentifiers.includes(organisationServiceIdentifier)) {
          return false;
        }
        organisationServiceCollectionIdentifiers.push(organisationServiceIdentifier);
        return true;
      });
      return [...organisationServicesToAdd, ...organisationServiceCollection];
    }
    return organisationServiceCollection;
  }
}
