import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrganisation, Organisation } from '../organisation.model';
import { OrganisationService } from '../service/organisation.service';
import { IBundle } from 'app/entities/bundle/bundle.model';
import { BundleService } from 'app/entities/bundle/service/bundle.service';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { IOrganisationService } from 'app/entities/organisation-service/organisation-service.model';
import { OrganisationServiceService } from 'app/entities/organisation-service/service/organisation-service.service';
import { IAuthInterface } from 'app/entities/auth-interface/auth-interface.model';
import { AuthInterfaceService } from 'app/entities/auth-interface/service/auth-interface.service';

@Component({
  selector: 'jhi-organisation-update',
  templateUrl: './organisation-update.component.html',
})
export class OrganisationUpdateComponent implements OnInit {
  isSaving = false;

  bundlesSharedCollection: IBundle[] = [];
  userDataSharedCollection: IUserData[] = [];
  organisationServicesSharedCollection: IOrganisationService[] = [];
  authInterfacesSharedCollection: IAuthInterface[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    email: [],
    password: [],
    token: [],
    subscriptions: [],
    userdatas: [],
    services: [],
    interfaces: [],
  });

  constructor(
    protected organisationService: OrganisationService,
    protected bundleService: BundleService,
    protected userDataService: UserDataService,
    protected organisationServiceService: OrganisationServiceService,
    protected authInterfaceService: AuthInterfaceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organisation }) => {
      this.updateForm(organisation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organisation = this.createFromForm();
    if (organisation.id !== undefined) {
      this.subscribeToSaveResponse(this.organisationService.update(organisation));
    } else {
      this.subscribeToSaveResponse(this.organisationService.create(organisation));
    }
  }

  trackBundleById(_index: number, item: IBundle): number {
    return item.id!;
  }

  trackUserDataById(_index: number, item: IUserData): number {
    return item.id!;
  }

  trackOrganisationServiceById(_index: number, item: IOrganisationService): number {
    return item.id!;
  }

  trackAuthInterfaceById(_index: number, item: IAuthInterface): number {
    return item.id!;
  }

  getSelectedOrganisationService(option: IOrganisationService, selectedVals?: IOrganisationService[]): IOrganisationService {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedAuthInterface(option: IAuthInterface, selectedVals?: IAuthInterface[]): IAuthInterface {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganisation>>): void {
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

  protected updateForm(organisation: IOrganisation): void {
    this.editForm.patchValue({
      id: organisation.id,
      name: organisation.name,
      description: organisation.description,
      email: organisation.email,
      password: organisation.password,
      token: organisation.token,
      subscriptions: organisation.subscriptions,
      userdatas: organisation.userdatas,
      services: organisation.services,
      interfaces: organisation.interfaces,
    });

    this.bundlesSharedCollection = this.bundleService.addBundleToCollectionIfMissing(
      this.bundlesSharedCollection,
      organisation.subscriptions
    );
    this.userDataSharedCollection = this.userDataService.addUserDataToCollectionIfMissing(
      this.userDataSharedCollection,
      organisation.userdatas
    );
    this.organisationServicesSharedCollection = this.organisationServiceService.addOrganisationServiceToCollectionIfMissing(
      this.organisationServicesSharedCollection,
      ...(organisation.services ?? [])
    );
    this.authInterfacesSharedCollection = this.authInterfaceService.addAuthInterfaceToCollectionIfMissing(
      this.authInterfacesSharedCollection,
      ...(organisation.interfaces ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bundleService
      .query()
      .pipe(map((res: HttpResponse<IBundle[]>) => res.body ?? []))
      .pipe(
        map((bundles: IBundle[]) => this.bundleService.addBundleToCollectionIfMissing(bundles, this.editForm.get('subscriptions')!.value))
      )
      .subscribe((bundles: IBundle[]) => (this.bundlesSharedCollection = bundles));

    this.userDataService
      .query()
      .pipe(map((res: HttpResponse<IUserData[]>) => res.body ?? []))
      .pipe(
        map((userData: IUserData[]) =>
          this.userDataService.addUserDataToCollectionIfMissing(userData, this.editForm.get('userdatas')!.value)
        )
      )
      .subscribe((userData: IUserData[]) => (this.userDataSharedCollection = userData));

    this.organisationServiceService
      .query()
      .pipe(map((res: HttpResponse<IOrganisationService[]>) => res.body ?? []))
      .pipe(
        map((organisationServices: IOrganisationService[]) =>
          this.organisationServiceService.addOrganisationServiceToCollectionIfMissing(
            organisationServices,
            ...(this.editForm.get('services')!.value ?? [])
          )
        )
      )
      .subscribe((organisationServices: IOrganisationService[]) => (this.organisationServicesSharedCollection = organisationServices));

    this.authInterfaceService
      .query()
      .pipe(map((res: HttpResponse<IAuthInterface[]>) => res.body ?? []))
      .pipe(
        map((authInterfaces: IAuthInterface[]) =>
          this.authInterfaceService.addAuthInterfaceToCollectionIfMissing(authInterfaces, ...(this.editForm.get('interfaces')!.value ?? []))
        )
      )
      .subscribe((authInterfaces: IAuthInterface[]) => (this.authInterfacesSharedCollection = authInterfaces));
  }

  protected createFromForm(): IOrganisation {
    return {
      ...new Organisation(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      email: this.editForm.get(['email'])!.value,
      password: this.editForm.get(['password'])!.value,
      token: this.editForm.get(['token'])!.value,
      subscriptions: this.editForm.get(['subscriptions'])!.value,
      userdatas: this.editForm.get(['userdatas'])!.value,
      services: this.editForm.get(['services'])!.value,
      interfaces: this.editForm.get(['interfaces'])!.value,
    };
  }
}
