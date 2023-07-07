import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IInterfaceParam, InterfaceParam } from '../interface-param.model';
import { InterfaceParamService } from '../service/interface-param.service';

@Component({
  selector: 'jhi-interface-param-update',
  templateUrl: './interface-param-update.component.html',
})
export class InterfaceParamUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    value: [],
  });

  constructor(
    protected interfaceParamService: InterfaceParamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interfaceParam }) => {
      this.updateForm(interfaceParam);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const interfaceParam = this.createFromForm();
    if (interfaceParam.id !== undefined) {
      this.subscribeToSaveResponse(this.interfaceParamService.update(interfaceParam));
    } else {
      this.subscribeToSaveResponse(this.interfaceParamService.create(interfaceParam));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInterfaceParam>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(interfaceParam: IInterfaceParam): void {
    this.editForm.patchValue({
      id: interfaceParam.id,
      name: interfaceParam.name,
      value: interfaceParam.value,
    });
  }

  protected createFromForm(): IInterfaceParam {
    return {
      ...new InterfaceParam(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
