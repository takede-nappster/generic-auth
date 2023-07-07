import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrganisationService, OrganisationService } from '../organisation-service.model';
import { OrganisationServiceService } from '../service/organisation-service.service';
import { IUserInfo } from 'app/entities/user-info/user-info.model';
import { UserInfoService } from 'app/entities/user-info/service/user-info.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';

@Component({
  selector: 'jhi-organisation-service-update',
  templateUrl: './organisation-service-update.component.html',
})
export class OrganisationServiceUpdateComponent implements OnInit {
  isSaving = false;

  userInfosSharedCollection: IUserInfo[] = [];
  groupesSharedCollection: IGroupe[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    members: [],
    groups: [],
  });

  constructor(
    protected organisationServiceService: OrganisationServiceService,
    protected userInfoService: UserInfoService,
    protected groupeService: GroupeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organisationService }) => {
      this.updateForm(organisationService);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organisationService = this.createFromForm();
    if (organisationService.id !== undefined) {
      this.subscribeToSaveResponse(this.organisationServiceService.update(organisationService));
    } else {
      this.subscribeToSaveResponse(this.organisationServiceService.create(organisationService));
    }
  }

  trackUserInfoById(_index: number, item: IUserInfo): number {
    return item.id!;
  }

  trackGroupeById(_index: number, item: IGroupe): number {
    return item.id!;
  }

  getSelectedUserInfo(option: IUserInfo, selectedVals?: IUserInfo[]): IUserInfo {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedGroupe(option: IGroupe, selectedVals?: IGroupe[]): IGroupe {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganisationService>>): void {
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

  protected updateForm(organisationService: IOrganisationService): void {
    this.editForm.patchValue({
      id: organisationService.id,
      name: organisationService.name,
      description: organisationService.description,
      members: organisationService.members,
      groups: organisationService.groups,
    });

    this.userInfosSharedCollection = this.userInfoService.addUserInfoToCollectionIfMissing(
      this.userInfosSharedCollection,
      ...(organisationService.members ?? [])
    );
    this.groupesSharedCollection = this.groupeService.addGroupeToCollectionIfMissing(
      this.groupesSharedCollection,
      ...(organisationService.groups ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userInfoService
      .query()
      .pipe(map((res: HttpResponse<IUserInfo[]>) => res.body ?? []))
      .pipe(
        map((userInfos: IUserInfo[]) =>
          this.userInfoService.addUserInfoToCollectionIfMissing(userInfos, ...(this.editForm.get('members')!.value ?? []))
        )
      )
      .subscribe((userInfos: IUserInfo[]) => (this.userInfosSharedCollection = userInfos));

    this.groupeService
      .query()
      .pipe(map((res: HttpResponse<IGroupe[]>) => res.body ?? []))
      .pipe(
        map((groupes: IGroupe[]) =>
          this.groupeService.addGroupeToCollectionIfMissing(groupes, ...(this.editForm.get('groups')!.value ?? []))
        )
      )
      .subscribe((groupes: IGroupe[]) => (this.groupesSharedCollection = groupes));
  }

  protected createFromForm(): IOrganisationService {
    return {
      ...new OrganisationService(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      members: this.editForm.get(['members'])!.value,
      groups: this.editForm.get(['groups'])!.value,
    };
  }
}
