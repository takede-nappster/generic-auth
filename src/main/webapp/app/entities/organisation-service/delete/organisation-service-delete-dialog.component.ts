import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganisationService } from '../organisation-service.model';
import { OrganisationServiceService } from '../service/organisation-service.service';

@Component({
  templateUrl: './organisation-service-delete-dialog.component.html',
})
export class OrganisationServiceDeleteDialogComponent {
  organisationService?: IOrganisationService;

  constructor(protected organisationServiceService: OrganisationServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organisationServiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
