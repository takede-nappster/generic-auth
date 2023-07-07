import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdditionalDataComponent } from './list/additional-data.component';
import { AdditionalDataDetailComponent } from './detail/additional-data-detail.component';
import { AdditionalDataUpdateComponent } from './update/additional-data-update.component';
import { AdditionalDataDeleteDialogComponent } from './delete/additional-data-delete-dialog.component';
import { AdditionalDataRoutingModule } from './route/additional-data-routing.module';

@NgModule({
  imports: [SharedModule, AdditionalDataRoutingModule],
  declarations: [
    AdditionalDataComponent,
    AdditionalDataDetailComponent,
    AdditionalDataUpdateComponent,
    AdditionalDataDeleteDialogComponent,
  ],
  entryComponents: [AdditionalDataDeleteDialogComponent],
})
export class AdditionalDataModule {}
