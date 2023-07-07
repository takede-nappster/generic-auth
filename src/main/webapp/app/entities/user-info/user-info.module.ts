import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserInfoComponent } from './list/user-info.component';
import { UserInfoDetailComponent } from './detail/user-info-detail.component';
import { UserInfoUpdateComponent } from './update/user-info-update.component';
import { UserInfoDeleteDialogComponent } from './delete/user-info-delete-dialog.component';
import { UserInfoRoutingModule } from './route/user-info-routing.module';

@NgModule({
  imports: [SharedModule, UserInfoRoutingModule],
  declarations: [UserInfoComponent, UserInfoDetailComponent, UserInfoUpdateComponent, UserInfoDeleteDialogComponent],
  entryComponents: [UserInfoDeleteDialogComponent],
})
export class UserInfoModule {}
