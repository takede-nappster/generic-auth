import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuthInterfaceComponent } from './list/auth-interface.component';
import { AuthInterfaceDetailComponent } from './detail/auth-interface-detail.component';
import { AuthInterfaceUpdateComponent } from './update/auth-interface-update.component';
import { AuthInterfaceDeleteDialogComponent } from './delete/auth-interface-delete-dialog.component';
import { AuthInterfaceRoutingModule } from './route/auth-interface-routing.module';

@NgModule({
  imports: [SharedModule, AuthInterfaceRoutingModule],
  declarations: [AuthInterfaceComponent, AuthInterfaceDetailComponent, AuthInterfaceUpdateComponent, AuthInterfaceDeleteDialogComponent],
  entryComponents: [AuthInterfaceDeleteDialogComponent],
})
export class AuthInterfaceModule {}
