import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganisationService, OrganisationService } from '../organisation-service.model';
import { OrganisationServiceService } from '../service/organisation-service.service';

@Injectable({ providedIn: 'root' })
export class OrganisationServiceRoutingResolveService implements Resolve<IOrganisationService> {
  constructor(protected service: OrganisationServiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganisationService> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organisationService: HttpResponse<OrganisationService>) => {
          if (organisationService.body) {
            return of(organisationService.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganisationService());
  }
}
