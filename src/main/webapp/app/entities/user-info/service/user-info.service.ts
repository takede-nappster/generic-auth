import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserInfo, getUserInfoIdentifier } from '../user-info.model';

export type EntityResponseType = HttpResponse<IUserInfo>;
export type EntityArrayResponseType = HttpResponse<IUserInfo[]>;

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userInfo: IUserInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userInfo);
    return this.http
      .post<IUserInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userInfo: IUserInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userInfo);
    return this.http
      .put<IUserInfo>(`${this.resourceUrl}/${getUserInfoIdentifier(userInfo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(userInfo: IUserInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userInfo);
    return this.http
      .patch<IUserInfo>(`${this.resourceUrl}/${getUserInfoIdentifier(userInfo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUserInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserInfoToCollectionIfMissing(userInfoCollection: IUserInfo[], ...userInfosToCheck: (IUserInfo | null | undefined)[]): IUserInfo[] {
    const userInfos: IUserInfo[] = userInfosToCheck.filter(isPresent);
    if (userInfos.length > 0) {
      const userInfoCollectionIdentifiers = userInfoCollection.map(userInfoItem => getUserInfoIdentifier(userInfoItem)!);
      const userInfosToAdd = userInfos.filter(userInfoItem => {
        const userInfoIdentifier = getUserInfoIdentifier(userInfoItem);
        if (userInfoIdentifier == null || userInfoCollectionIdentifiers.includes(userInfoIdentifier)) {
          return false;
        }
        userInfoCollectionIdentifiers.push(userInfoIdentifier);
        return true;
      });
      return [...userInfosToAdd, ...userInfoCollection];
    }
    return userInfoCollection;
  }

  protected convertDateFromClient(userInfo: IUserInfo): IUserInfo {
    return Object.assign({}, userInfo, {
      dateOfBirth: userInfo.dateOfBirth?.isValid() ? userInfo.dateOfBirth.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateOfBirth = res.body.dateOfBirth ? dayjs(res.body.dateOfBirth) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((userInfo: IUserInfo) => {
        userInfo.dateOfBirth = userInfo.dateOfBirth ? dayjs(userInfo.dateOfBirth) : undefined;
      });
    }
    return res;
  }
}
