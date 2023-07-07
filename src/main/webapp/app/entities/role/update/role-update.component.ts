import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRole, Role } from '../role.model';
import { RoleService } from '../service/role.service';
import { IAuthorization } from 'app/entities/authorization/authorization.model';
import { AuthorizationService } from 'app/entities/authorization/service/authorization.service';

@Component({
  selector: 'jhi-role-update',
  templateUrl: './role-update.component.html',
})
export class RoleUpdateComponent implements OnInit {
  isSaving = false;

  authorizationsSharedCollection: IAuthorization[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    authrizations: [],
  });

  constructor(
    protected roleService: RoleService,
    protected authorizationService: AuthorizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ role }) => {
      this.updateForm(role);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const role = this.createFromForm();
    if (role.id !== undefined) {
      this.subscribeToSaveResponse(this.roleService.update(role));
    } else {
      this.subscribeToSaveResponse(this.roleService.create(role));
    }
  }

  trackAuthorizationById(_index: number, item: IAuthorization): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRole>>): void {
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

  protected updateForm(role: IRole): void {
    this.editForm.patchValue({
      id: role.id,
      name: role.name,
      description: role.description,
      authrizations: role.authrizations,
    });

    this.authorizationsSharedCollection = this.authorizationService.addAuthorizationToCollectionIfMissing(
      this.authorizationsSharedCollection,
      role.authrizations
    );
  }

  protected loadRelationshipsOptions(): void {
    this.authorizationService
      .query()
      .pipe(map((res: HttpResponse<IAuthorization[]>) => res.body ?? []))
      .pipe(
        map((authorizations: IAuthorization[]) =>
          this.authorizationService.addAuthorizationToCollectionIfMissing(authorizations, this.editForm.get('authrizations')!.value)
        )
      )
      .subscribe((authorizations: IAuthorization[]) => (this.authorizationsSharedCollection = authorizations));
  }

  protected createFromForm(): IRole {
    return {
      ...new Role(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      authrizations: this.editForm.get(['authrizations'])!.value,
    };
  }
}
