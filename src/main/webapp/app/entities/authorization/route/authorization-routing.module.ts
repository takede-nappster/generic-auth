import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuthorizationComponent } from '../list/authorization.component';
import { AuthorizationDetailComponent } from '../detail/authorization-detail.component';
import { AuthorizationUpdateComponent } from '../update/authorization-update.component';
import { AuthorizationRoutingResolveService } from './authorization-routing-resolve.service';

const authorizationRoute: Routes = [
  {
    path: '',
    component: AuthorizationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuthorizationDetailComponent,
    resolve: {
      authorization: AuthorizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuthorizationUpdateComponent,
    resolve: {
      authorization: AuthorizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuthorizationUpdateComponent,
    resolve: {
      authorization: AuthorizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authorizationRoute)],
  exports: [RouterModule],
})
export class AuthorizationRoutingModule {}
