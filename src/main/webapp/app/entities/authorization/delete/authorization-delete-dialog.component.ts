import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuthorization } from '../authorization.model';
import { AuthorizationService } from '../service/authorization.service';

@Component({
  templateUrl: './authorization-delete-dialog.component.html',
})
export class AuthorizationDeleteDialogComponent {
  authorization?: IAuthorization;

  constructor(protected authorizationService: AuthorizationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.authorizationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
