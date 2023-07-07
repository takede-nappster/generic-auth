import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBundle, Bundle } from '../bundle.model';
import { BundleService } from '../service/bundle.service';

@Injectable({ providedIn: 'root' })
export class BundleRoutingResolveService implements Resolve<IBundle> {
  constructor(protected service: BundleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBundle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bundle: HttpResponse<Bundle>) => {
          if (bundle.body) {
            return of(bundle.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bundle());
  }
}
