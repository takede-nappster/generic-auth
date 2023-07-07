import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BundleComponent } from '../list/bundle.component';
import { BundleDetailComponent } from '../detail/bundle-detail.component';
import { BundleUpdateComponent } from '../update/bundle-update.component';
import { BundleRoutingResolveService } from './bundle-routing-resolve.service';

const bundleRoute: Routes = [
  {
    path: '',
    component: BundleComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BundleDetailComponent,
    resolve: {
      bundle: BundleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BundleUpdateComponent,
    resolve: {
      bundle: BundleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BundleUpdateComponent,
    resolve: {
      bundle: BundleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bundleRoute)],
  exports: [RouterModule],
})
export class BundleRoutingModule {}
