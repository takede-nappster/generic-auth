import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAuthInterface, AuthInterface } from '../auth-interface.model';
import { AuthInterfaceService } from '../service/auth-interface.service';
import { IInterfaceParam } from 'app/entities/interface-param/interface-param.model';
import { InterfaceParamService } from 'app/entities/interface-param/service/interface-param.service';

@Component({
  selector: 'jhi-auth-interface-update',
  templateUrl: './auth-interface-update.component.html',
})
export class AuthInterfaceUpdateComponent implements OnInit {
  isSaving = false;

  interfaceParamsSharedCollection: IInterfaceParam[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    url: [],
    driverName: [],
    prams: [],
  });

  constructor(
    protected authInterfaceService: AuthInterfaceService,
    protected interfaceParamService: InterfaceParamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authInterface }) => {
      this.updateForm(authInterface);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const authInterface = this.createFromForm();
    if (authInterface.id !== undefined) {
      this.subscribeToSaveResponse(this.authInterfaceService.update(authInterface));
    } else {
      this.subscribeToSaveResponse(this.authInterfaceService.create(authInterface));
    }
  }

  trackInterfaceParamById(_index: number, item: IInterfaceParam): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuthInterface>>): void {
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

  protected updateForm(authInterface: IAuthInterface): void {
    this.editForm.patchValue({
      id: authInterface.id,
      name: authInterface.name,
      description: authInterface.description,
      url: authInterface.url,
      driverName: authInterface.driverName,
      prams: authInterface.prams,
    });

    this.interfaceParamsSharedCollection = this.interfaceParamService.addInterfaceParamToCollectionIfMissing(
      this.interfaceParamsSharedCollection,
      authInterface.prams
    );
  }

  protected loadRelationshipsOptions(): void {
    this.interfaceParamService
      .query()
      .pipe(map((res: HttpResponse<IInterfaceParam[]>) => res.body ?? []))
      .pipe(
        map((interfaceParams: IInterfaceParam[]) =>
          this.interfaceParamService.addInterfaceParamToCollectionIfMissing(interfaceParams, this.editForm.get('prams')!.value)
        )
      )
      .subscribe((interfaceParams: IInterfaceParam[]) => (this.interfaceParamsSharedCollection = interfaceParams));
  }

  protected createFromForm(): IAuthInterface {
    return {
      ...new AuthInterface(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      url: this.editForm.get(['url'])!.value,
      driverName: this.editForm.get(['driverName'])!.value,
      prams: this.editForm.get(['prams'])!.value,
    };
  }
}
