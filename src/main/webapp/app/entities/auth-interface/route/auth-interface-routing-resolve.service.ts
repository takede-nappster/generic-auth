import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAuthInterface, AuthInterface } from '../auth-interface.model';
import { AuthInterfaceService } from '../service/auth-interface.service';

@Injectable({ providedIn: 'root' })
export class AuthInterfaceRoutingResolveService implements Resolve<IAuthInterface> {
  constructor(protected service: AuthInterfaceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAuthInterface> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((authInterface: HttpResponse<AuthInterface>) => {
          if (authInterface.body) {
            return of(authInterface.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AuthInterface());
  }
}
