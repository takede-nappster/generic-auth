import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganisationServiceComponent } from '../list/organisation-service.component';
import { OrganisationServiceDetailComponent } from '../detail/organisation-service-detail.component';
import { OrganisationServiceUpdateComponent } from '../update/organisation-service-update.component';
import { OrganisationServiceRoutingResolveService } from './organisation-service-routing-resolve.service';

const organisationServiceRoute: Routes = [
  {
    path: '',
    component: OrganisationServiceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganisationServiceDetailComponent,
    resolve: {
      organisationService: OrganisationServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganisationServiceUpdateComponent,
    resolve: {
      organisationService: OrganisationServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganisationServiceUpdateComponent,
    resolve: {
      organisationService: OrganisationServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organisationServiceRoute)],
  exports: [RouterModule],
})
export class OrganisationServiceRoutingModule {}
