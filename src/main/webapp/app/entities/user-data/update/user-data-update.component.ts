import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUserData, UserData } from '../user-data.model';
import { UserDataService } from '../service/user-data.service';
import { DataType } from 'app/entities/enumerations/data-type.model';

@Component({
  selector: 'jhi-user-data-update',
  templateUrl: './user-data-update.component.html',
})
export class UserDataUpdateComponent implements OnInit {
  isSaving = false;
  dataTypeValues = Object.keys(DataType);

  editForm = this.fb.group({
    id: [],
    fieldName: [],
    fieldCode: [],
    requiredStatus: [],
    type: [],
  });

  constructor(protected userDataService: UserDataService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userData }) => {
      this.updateForm(userData);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userData = this.createFromForm();
    if (userData.id !== undefined) {
      this.subscribeToSaveResponse(this.userDataService.update(userData));
    } else {
      this.subscribeToSaveResponse(this.userDataService.create(userData));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserData>>): void {
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

  protected updateForm(userData: IUserData): void {
    this.editForm.patchValue({
      id: userData.id,
      fieldName: userData.fieldName,
      fieldCode: userData.fieldCode,
      requiredStatus: userData.requiredStatus,
      type: userData.type,
    });
  }

  protected createFromForm(): IUserData {
    return {
      ...new UserData(),
      id: this.editForm.get(['id'])!.value,
      fieldName: this.editForm.get(['fieldName'])!.value,
      fieldCode: this.editForm.get(['fieldCode'])!.value,
      requiredStatus: this.editForm.get(['requiredStatus'])!.value,
      type: this.editForm.get(['type'])!.value,
    };
  }
}
