import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdditionalData } from '../additional-data.model';
import { AdditionalDataService } from '../service/additional-data.service';

@Component({
  templateUrl: './additional-data-delete-dialog.component.html',
})
export class AdditionalDataDeleteDialogComponent {
  additionalData?: IAdditionalData;

  constructor(protected additionalDataService: AdditionalDataService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.additionalDataService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
