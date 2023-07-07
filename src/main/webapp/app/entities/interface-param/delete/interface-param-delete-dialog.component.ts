import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInterfaceParam } from '../interface-param.model';
import { InterfaceParamService } from '../service/interface-param.service';

@Component({
  templateUrl: './interface-param-delete-dialog.component.html',
})
export class InterfaceParamDeleteDialogComponent {
  interfaceParam?: IInterfaceParam;

  constructor(protected interfaceParamService: InterfaceParamService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.interfaceParamService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
