import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdditionalData, getAdditionalDataIdentifier } from '../additional-data.model';

export type EntityResponseType = HttpResponse<IAdditionalData>;
export type EntityArrayResponseType = HttpResponse<IAdditionalData[]>;

@Injectable({ providedIn: 'root' })
export class AdditionalDataService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/additional-data');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(additionalData: IAdditionalData): Observable<EntityResponseType> {
    return this.http.post<IAdditionalData>(this.resourceUrl, additionalData, { observe: 'response' });
  }

  update(additionalData: IAdditionalData): Observable<EntityResponseType> {
    return this.http.put<IAdditionalData>(`${this.resourceUrl}/${getAdditionalDataIdentifier(additionalData) as number}`, additionalData, {
      observe: 'response',
    });
  }

  partialUpdate(additionalData: IAdditionalData): Observable<EntityResponseType> {
    return this.http.patch<IAdditionalData>(
      `${this.resourceUrl}/${getAdditionalDataIdentifier(additionalData) as number}`,
      additionalData,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdditionalData>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdditionalData[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdditionalDataToCollectionIfMissing(
    additionalDataCollection: IAdditionalData[],
    ...additionalDataToCheck: (IAdditionalData | null | undefined)[]
  ): IAdditionalData[] {
    const additionalData: IAdditionalData[] = additionalDataToCheck.filter(isPresent);
    if (additionalData.length > 0) {
      const additionalDataCollectionIdentifiers = additionalDataCollection.map(
        additionalDataItem => getAdditionalDataIdentifier(additionalDataItem)!
      );
      const additionalDataToAdd = additionalData.filter(additionalDataItem => {
        const additionalDataIdentifier = getAdditionalDataIdentifier(additionalDataItem);
        if (additionalDataIdentifier == null || additionalDataCollectionIdentifiers.includes(additionalDataIdentifier)) {
          return false;
        }
        additionalDataCollectionIdentifiers.push(additionalDataIdentifier);
        return true;
      });
      return [...additionalDataToAdd, ...additionalDataCollection];
    }
    return additionalDataCollection;
  }
}
