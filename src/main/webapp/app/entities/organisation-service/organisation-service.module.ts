import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganisationServiceComponent } from './list/organisation-service.component';
import { OrganisationServiceDetailComponent } from './detail/organisation-service-detail.component';
import { OrganisationServiceUpdateComponent } from './update/organisation-service-update.component';
import { OrganisationServiceDeleteDialogComponent } from './delete/organisation-service-delete-dialog.component';
import { OrganisationServiceRoutingModule } from './route/organisation-service-routing.module';

@NgModule({
  imports: [SharedModule, OrganisationServiceRoutingModule],
  declarations: [
    OrganisationServiceComponent,
    OrganisationServiceDetailComponent,
    OrganisationServiceUpdateComponent,
    OrganisationServiceDeleteDialogComponent,
  ],
  entryComponents: [OrganisationServiceDeleteDialogComponent],
})
export class OrganisationServiceModule {}
