import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserInfo, UserInfo } from '../user-info.model';
import { UserInfoService } from '../service/user-info.service';

@Injectable({ providedIn: 'root' })
export class UserInfoRoutingResolveService implements Resolve<IUserInfo> {
  constructor(protected service: UserInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userInfo: HttpResponse<UserInfo>) => {
          if (userInfo.body) {
            return of(userInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserInfo());
  }
}
