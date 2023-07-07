import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAdditionalData, AdditionalData } from '../additional-data.model';
import { AdditionalDataService } from '../service/additional-data.service';

@Component({
  selector: 'jhi-additional-data-update',
  templateUrl: './additional-data-update.component.html',
})
export class AdditionalDataUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fieldCode: [],
    value: [],
  });

  constructor(
    protected additionalDataService: AdditionalDataService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ additionalData }) => {
      this.updateForm(additionalData);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const additionalData = this.createFromForm();
    if (additionalData.id !== undefined) {
      this.subscribeToSaveResponse(this.additionalDataService.update(additionalData));
    } else {
      this.subscribeToSaveResponse(this.additionalDataService.create(additionalData));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdditionalData>>): void {
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

  protected updateForm(additionalData: IAdditionalData): void {
    this.editForm.patchValue({
      id: additionalData.id,
      fieldCode: additionalData.fieldCode,
      value: additionalData.value,
    });
  }

  protected createFromForm(): IAdditionalData {
    return {
      ...new AdditionalData(),
      id: this.editForm.get(['id'])!.value,
      fieldCode: this.editForm.get(['fieldCode'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
