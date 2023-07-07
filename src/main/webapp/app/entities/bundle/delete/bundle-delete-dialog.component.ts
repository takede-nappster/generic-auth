import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBundle } from '../bundle.model';
import { BundleService } from '../service/bundle.service';

@Component({
  templateUrl: './bundle-delete-dialog.component.html',
})
export class BundleDeleteDialogComponent {
  bundle?: IBundle;

  constructor(protected bundleService: BundleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bundleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
