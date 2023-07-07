import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInterfaceParam, InterfaceParam } from '../interface-param.model';
import { InterfaceParamService } from '../service/interface-param.service';

@Injectable({ providedIn: 'root' })
export class InterfaceParamRoutingResolveService implements Resolve<IInterfaceParam> {
  constructor(protected service: InterfaceParamService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInterfaceParam> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((interfaceParam: HttpResponse<InterfaceParam>) => {
          if (interfaceParam.body) {
            return of(interfaceParam.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new InterfaceParam());
  }
}
