import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuthInterface } from '../auth-interface.model';
import { AuthInterfaceService } from '../service/auth-interface.service';

@Component({
  templateUrl: './auth-interface-delete-dialog.component.html',
})
export class AuthInterfaceDeleteDialogComponent {
  authInterface?: IAuthInterface;

  constructor(protected authInterfaceService: AuthInterfaceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.authInterfaceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
