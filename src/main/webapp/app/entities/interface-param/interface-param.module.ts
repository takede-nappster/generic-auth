import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InterfaceParamComponent } from './list/interface-param.component';
import { InterfaceParamDetailComponent } from './detail/interface-param-detail.component';
import { InterfaceParamUpdateComponent } from './update/interface-param-update.component';
import { InterfaceParamDeleteDialogComponent } from './delete/interface-param-delete-dialog.component';
import { InterfaceParamRoutingModule } from './route/interface-param-routing.module';

@NgModule({
  imports: [SharedModule, InterfaceParamRoutingModule],
  declarations: [
    InterfaceParamComponent,
    InterfaceParamDetailComponent,
    InterfaceParamUpdateComponent,
    InterfaceParamDeleteDialogComponent,
  ],
  entryComponents: [InterfaceParamDeleteDialogComponent],
})
export class InterfaceParamModule {}
