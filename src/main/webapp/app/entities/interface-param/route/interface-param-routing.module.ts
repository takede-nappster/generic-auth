import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InterfaceParamComponent } from '../list/interface-param.component';
import { InterfaceParamDetailComponent } from '../detail/interface-param-detail.component';
import { InterfaceParamUpdateComponent } from '../update/interface-param-update.component';
import { InterfaceParamRoutingResolveService } from './interface-param-routing-resolve.service';

const interfaceParamRoute: Routes = [
  {
    path: '',
    component: InterfaceParamComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InterfaceParamDetailComponent,
    resolve: {
      interfaceParam: InterfaceParamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InterfaceParamUpdateComponent,
    resolve: {
      interfaceParam: InterfaceParamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InterfaceParamUpdateComponent,
    resolve: {
      interfaceParam: InterfaceParamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(interfaceParamRoute)],
  exports: [RouterModule],
})
export class InterfaceParamRoutingModule {}
