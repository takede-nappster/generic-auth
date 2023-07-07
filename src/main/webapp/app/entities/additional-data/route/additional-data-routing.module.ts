import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdditionalDataComponent } from '../list/additional-data.component';
import { AdditionalDataDetailComponent } from '../detail/additional-data-detail.component';
import { AdditionalDataUpdateComponent } from '../update/additional-data-update.component';
import { AdditionalDataRoutingResolveService } from './additional-data-routing-resolve.service';

const additionalDataRoute: Routes = [
  {
    path: '',
    component: AdditionalDataComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdditionalDataDetailComponent,
    resolve: {
      additionalData: AdditionalDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdditionalDataUpdateComponent,
    resolve: {
      additionalData: AdditionalDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdditionalDataUpdateComponent,
    resolve: {
      additionalData: AdditionalDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(additionalDataRoute)],
  exports: [RouterModule],
})
export class AdditionalDataRoutingModule {}
