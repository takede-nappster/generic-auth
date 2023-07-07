import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BundleComponent } from './list/bundle.component';
import { BundleDetailComponent } from './detail/bundle-detail.component';
import { BundleUpdateComponent } from './update/bundle-update.component';
import { BundleDeleteDialogComponent } from './delete/bundle-delete-dialog.component';
import { BundleRoutingModule } from './route/bundle-routing.module';

@NgModule({
  imports: [SharedModule, BundleRoutingModule],
  declarations: [BundleComponent, BundleDetailComponent, BundleUpdateComponent, BundleDeleteDialogComponent],
  entryComponents: [BundleDeleteDialogComponent],
})
export class BundleModule {}
