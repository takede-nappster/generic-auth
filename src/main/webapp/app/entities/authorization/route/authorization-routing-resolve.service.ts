import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAuthorization, Authorization } from '../authorization.model';
import { AuthorizationService } from '../service/authorization.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationRoutingResolveService implements Resolve<IAuthorization> {
  constructor(protected service: AuthorizationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAuthorization> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((authorization: HttpResponse<Authorization>) => {
          if (authorization.body) {
            return of(authorization.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Authorization());
  }
}
