import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAuthorization, Authorization } from '../authorization.model';
import { AuthorizationService } from '../service/authorization.service';

@Component({
  selector: 'jhi-authorization-update',
  templateUrl: './authorization-update.component.html',
})
export class AuthorizationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    code: [],
  });

  constructor(protected authorizationService: AuthorizationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authorization }) => {
      this.updateForm(authorization);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const authorization = this.createFromForm();
    if (authorization.id !== undefined) {
      this.subscribeToSaveResponse(this.authorizationService.update(authorization));
    } else {
      this.subscribeToSaveResponse(this.authorizationService.create(authorization));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuthorization>>): void {
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

  protected updateForm(authorization: IAuthorization): void {
    this.editForm.patchValue({
      id: authorization.id,
      name: authorization.name,
      description: authorization.description,
      code: authorization.code,
    });
  }

  protected createFromForm(): IAuthorization {
    return {
      ...new Authorization(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      code: this.editForm.get(['code'])!.value,
    };
  }
}
