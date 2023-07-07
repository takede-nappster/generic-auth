import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBundle, Bundle } from '../bundle.model';
import { BundleService } from '../service/bundle.service';

@Component({
  selector: 'jhi-bundle-update',
  templateUrl: './bundle-update.component.html',
})
export class BundleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
  });

  constructor(protected bundleService: BundleService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bundle }) => {
      this.updateForm(bundle);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bundle = this.createFromForm();
    if (bundle.id !== undefined) {
      this.subscribeToSaveResponse(this.bundleService.update(bundle));
    } else {
      this.subscribeToSaveResponse(this.bundleService.create(bundle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBundle>>): void {
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

  protected updateForm(bundle: IBundle): void {
    this.editForm.patchValue({
      id: bundle.id,
      startDate: bundle.startDate,
      endDate: bundle.endDate,
    });
  }

  protected createFromForm(): IBundle {
    return {
      ...new Bundle(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
    };
  }
}
