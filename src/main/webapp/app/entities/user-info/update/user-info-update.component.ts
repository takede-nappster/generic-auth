import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserInfo, UserInfo } from '../user-info.model';
import { UserInfoService } from '../service/user-info.service';
import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';
import { IAdditionalData } from 'app/entities/additional-data/additional-data.model';
import { AdditionalDataService } from 'app/entities/additional-data/service/additional-data.service';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';
import { UserType } from 'app/entities/enumerations/user-type.model';

@Component({
  selector: 'jhi-user-info-update',
  templateUrl: './user-info-update.component.html',
})
export class UserInfoUpdateComponent implements OnInit {
  isSaving = false;
  userTypeValues = Object.keys(UserType);

  rolesSharedCollection: IRole[] = [];
  groupesSharedCollection: IGroupe[] = [];
  additionalDataSharedCollection: IAdditionalData[] = [];
  sessionsSharedCollection: ISession[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    username: [],
    imagebiometric: [],
    dateOfBirth: [],
    userType: [],
    roles: [],
    groupes: [],
    additionalDatas: [],
    sessions: [],
  });

  constructor(
    protected userInfoService: UserInfoService,
    protected roleService: RoleService,
    protected groupeService: GroupeService,
    protected additionalDataService: AdditionalDataService,
    protected sessionService: SessionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userInfo }) => {
      this.updateForm(userInfo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userInfo = this.createFromForm();
    if (userInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.userInfoService.update(userInfo));
    } else {
      this.subscribeToSaveResponse(this.userInfoService.create(userInfo));
    }
  }

  trackRoleById(_index: number, item: IRole): number {
    return item.id!;
  }

  trackGroupeById(_index: number, item: IGroupe): number {
    return item.id!;
  }

  trackAdditionalDataById(_index: number, item: IAdditionalData): number {
    return item.id!;
  }

  trackSessionById(_index: number, item: ISession): number {
    return item.id!;
  }

  getSelectedAdditionalData(option: IAdditionalData, selectedVals?: IAdditionalData[]): IAdditionalData {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedSession(option: ISession, selectedVals?: ISession[]): ISession {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInfo>>): void {
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

  protected updateForm(userInfo: IUserInfo): void {
    this.editForm.patchValue({
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      imagebiometric: userInfo.imagebiometric,
      dateOfBirth: userInfo.dateOfBirth,
      userType: userInfo.userType,
      roles: userInfo.roles,
      groupes: userInfo.groupes,
      additionalDatas: userInfo.additionalDatas,
      sessions: userInfo.sessions,
    });

    this.rolesSharedCollection = this.roleService.addRoleToCollectionIfMissing(this.rolesSharedCollection, userInfo.roles);
    this.groupesSharedCollection = this.groupeService.addGroupeToCollectionIfMissing(this.groupesSharedCollection, userInfo.groupes);
    this.additionalDataSharedCollection = this.additionalDataService.addAdditionalDataToCollectionIfMissing(
      this.additionalDataSharedCollection,
      ...(userInfo.additionalDatas ?? [])
    );
    this.sessionsSharedCollection = this.sessionService.addSessionToCollectionIfMissing(
      this.sessionsSharedCollection,
      ...(userInfo.sessions ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.roleService
      .query()
      .pipe(map((res: HttpResponse<IRole[]>) => res.body ?? []))
      .pipe(map((roles: IRole[]) => this.roleService.addRoleToCollectionIfMissing(roles, this.editForm.get('roles')!.value)))
      .subscribe((roles: IRole[]) => (this.rolesSharedCollection = roles));

    this.groupeService
      .query()
      .pipe(map((res: HttpResponse<IGroupe[]>) => res.body ?? []))
      .pipe(map((groupes: IGroupe[]) => this.groupeService.addGroupeToCollectionIfMissing(groupes, this.editForm.get('groupes')!.value)))
      .subscribe((groupes: IGroupe[]) => (this.groupesSharedCollection = groupes));

    this.additionalDataService
      .query()
      .pipe(map((res: HttpResponse<IAdditionalData[]>) => res.body ?? []))
      .pipe(
        map((additionalData: IAdditionalData[]) =>
          this.additionalDataService.addAdditionalDataToCollectionIfMissing(
            additionalData,
            ...(this.editForm.get('additionalDatas')!.value ?? [])
          )
        )
      )
      .subscribe((additionalData: IAdditionalData[]) => (this.additionalDataSharedCollection = additionalData));

    this.sessionService
      .query()
      .pipe(map((res: HttpResponse<ISession[]>) => res.body ?? []))
      .pipe(
        map((sessions: ISession[]) =>
          this.sessionService.addSessionToCollectionIfMissing(sessions, ...(this.editForm.get('sessions')!.value ?? []))
        )
      )
      .subscribe((sessions: ISession[]) => (this.sessionsSharedCollection = sessions));
  }

  protected createFromForm(): IUserInfo {
    return {
      ...new UserInfo(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      username: this.editForm.get(['username'])!.value,
      imagebiometric: this.editForm.get(['imagebiometric'])!.value,
      dateOfBirth: this.editForm.get(['dateOfBirth'])!.value,
      userType: this.editForm.get(['userType'])!.value,
      roles: this.editForm.get(['roles'])!.value,
      groupes: this.editForm.get(['groupes'])!.value,
      additionalDatas: this.editForm.get(['additionalDatas'])!.value,
      sessions: this.editForm.get(['sessions'])!.value,
    };
  }
}
