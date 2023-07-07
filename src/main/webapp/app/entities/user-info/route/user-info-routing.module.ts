import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserInfoComponent } from '../list/user-info.component';
import { UserInfoDetailComponent } from '../detail/user-info-detail.component';
import { UserInfoUpdateComponent } from '../update/user-info-update.component';
import { UserInfoRoutingResolveService } from './user-info-routing-resolve.service';

const userInfoRoute: Routes = [
  {
    path: '',
    component: UserInfoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserInfoDetailComponent,
    resolve: {
      userInfo: UserInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserInfoUpdateComponent,
    resolve: {
      userInfo: UserInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserInfoUpdateComponent,
    resolve: {
      userInfo: UserInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userInfoRoute)],
  exports: [RouterModule],
})
export class UserInfoRoutingModule {}
