import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBundle, getBundleIdentifier } from '../bundle.model';

export type EntityResponseType = HttpResponse<IBundle>;
export type EntityArrayResponseType = HttpResponse<IBundle[]>;

@Injectable({ providedIn: 'root' })
export class BundleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bundles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bundle: IBundle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bundle);
    return this.http
      .post<IBundle>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bundle: IBundle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bundle);
    return this.http
      .put<IBundle>(`${this.resourceUrl}/${getBundleIdentifier(bundle) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bundle: IBundle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bundle);
    return this.http
      .patch<IBundle>(`${this.resourceUrl}/${getBundleIdentifier(bundle) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBundle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBundle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBundleToCollectionIfMissing(bundleCollection: IBundle[], ...bundlesToCheck: (IBundle | null | undefined)[]): IBundle[] {
    const bundles: IBundle[] = bundlesToCheck.filter(isPresent);
    if (bundles.length > 0) {
      const bundleCollectionIdentifiers = bundleCollection.map(bundleItem => getBundleIdentifier(bundleItem)!);
      const bundlesToAdd = bundles.filter(bundleItem => {
        const bundleIdentifier = getBundleIdentifier(bundleItem);
        if (bundleIdentifier == null || bundleCollectionIdentifiers.includes(bundleIdentifier)) {
          return false;
        }
        bundleCollectionIdentifiers.push(bundleIdentifier);
        return true;
      });
      return [...bundlesToAdd, ...bundleCollection];
    }
    return bundleCollection;
  }

  protected convertDateFromClient(bundle: IBundle): IBundle {
    return Object.assign({}, bundle, {
      startDate: bundle.startDate?.isValid() ? bundle.startDate.format(DATE_FORMAT) : undefined,
      endDate: bundle.endDate?.isValid() ? bundle.endDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bundle: IBundle) => {
        bundle.startDate = bundle.startDate ? dayjs(bundle.startDate) : undefined;
        bundle.endDate = bundle.endDate ? dayjs(bundle.endDate) : undefined;
      });
    }
    return res;
  }
}
