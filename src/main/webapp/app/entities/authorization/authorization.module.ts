import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuthorizationComponent } from './list/authorization.component';
import { AuthorizationDetailComponent } from './detail/authorization-detail.component';
import { AuthorizationUpdateComponent } from './update/authorization-update.component';
import { AuthorizationDeleteDialogComponent } from './delete/authorization-delete-dialog.component';
import { AuthorizationRoutingModule } from './route/authorization-routing.module';

@NgModule({
  imports: [SharedModule, AuthorizationRoutingModule],
  declarations: [AuthorizationComponent, AuthorizationDetailComponent, AuthorizationUpdateComponent, AuthorizationDeleteDialogComponent],
  entryComponents: [AuthorizationDeleteDialogComponent],
})
export class AuthorizationModule {}
