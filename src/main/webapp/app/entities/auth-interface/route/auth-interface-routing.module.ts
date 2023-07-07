import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuthInterfaceComponent } from '../list/auth-interface.component';
import { AuthInterfaceDetailComponent } from '../detail/auth-interface-detail.component';
import { AuthInterfaceUpdateComponent } from '../update/auth-interface-update.component';
import { AuthInterfaceRoutingResolveService } from './auth-interface-routing-resolve.service';

const authInterfaceRoute: Routes = [
  {
    path: '',
    component: AuthInterfaceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuthInterfaceDetailComponent,
    resolve: {
      authInterface: AuthInterfaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuthInterfaceUpdateComponent,
    resolve: {
      authInterface: AuthInterfaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuthInterfaceUpdateComponent,
    resolve: {
      authInterface: AuthInterfaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authInterfaceRoute)],
  exports: [RouterModule],
})
export class AuthInterfaceRoutingModule {}
