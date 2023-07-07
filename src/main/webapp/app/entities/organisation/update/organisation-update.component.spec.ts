import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrganisationService } from '../service/organisation.service';
import { IOrganisation, Organisation } from '../organisation.model';
import { IBundle } from 'app/entities/bundle/bundle.model';
import { BundleService } from 'app/entities/bundle/service/bundle.service';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { IOrganisationService } from 'app/entities/organisation-service/organisation-service.model';
import { OrganisationServiceService } from 'app/entities/organisation-service/service/organisation-service.service';
import { IAuthInterface } from 'app/entities/auth-interface/auth-interface.model';
import { AuthInterfaceService } from 'app/entities/auth-interface/service/auth-interface.service';

import { OrganisationUpdateComponent } from './organisation-update.component';

describe('Organisation Management Update Component', () => {
  let comp: OrganisationUpdateComponent;
  let fixture: ComponentFixture<OrganisationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organisationService: OrganisationService;
  let bundleService: BundleService;
  let userDataService: UserDataService;
  let organisationServiceService: OrganisationServiceService;
  let authInterfaceService: AuthInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrganisationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrganisationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganisationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organisationService = TestBed.inject(OrganisationService);
    bundleService = TestBed.inject(BundleService);
    userDataService = TestBed.inject(UserDataService);
    organisationServiceService = TestBed.inject(OrganisationServiceService);
    authInterfaceService = TestBed.inject(AuthInterfaceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Bundle query and add missing value', () => {
      const organisation: IOrganisation = { id: 456 };
      const subscriptions: IBundle = { id: 81962 };
      organisation.subscriptions = subscriptions;

      const bundleCollection: IBundle[] = [{ id: 17620 }];
      jest.spyOn(bundleService, 'query').mockReturnValue(of(new HttpResponse({ body: bundleCollection })));
      const additionalBundles = [subscriptions];
      const expectedCollection: IBundle[] = [...additionalBundles, ...bundleCollection];
      jest.spyOn(bundleService, 'addBundleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      expect(bundleService.query).toHaveBeenCalled();
      expect(bundleService.addBundleToCollectionIfMissing).toHaveBeenCalledWith(bundleCollection, ...additionalBundles);
      expect(comp.bundlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserData query and add missing value', () => {
      const organisation: IOrganisation = { id: 456 };
      const userdatas: IUserData = { id: 98211 };
      organisation.userdatas = userdatas;

      const userDataCollection: IUserData[] = [{ id: 47899 }];
      jest.spyOn(userDataService, 'query').mockReturnValue(of(new HttpResponse({ body: userDataCollection })));
      const additionalUserData = [userdatas];
      const expectedCollection: IUserData[] = [...additionalUserData, ...userDataCollection];
      jest.spyOn(userDataService, 'addUserDataToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      expect(userDataService.query).toHaveBeenCalled();
      expect(userDataService.addUserDataToCollectionIfMissing).toHaveBeenCalledWith(userDataCollection, ...additionalUserData);
      expect(comp.userDataSharedCollection).toEqual(expectedCollection);
    });

    it('Should call OrganisationService query and add missing value', () => {
      const organisation: IOrganisation = { id: 456 };
      const services: IOrganisationService[] = [{ id: 17014 }];
      organisation.services = services;

      const organisationServiceCollection: IOrganisationService[] = [{ id: 17186 }];
      jest.spyOn(organisationServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: organisationServiceCollection })));
      const additionalOrganisationServices = [...services];
      const expectedCollection: IOrganisationService[] = [...additionalOrganisationServices, ...organisationServiceCollection];
      jest.spyOn(organisationServiceService, 'addOrganisationServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      expect(organisationServiceService.query).toHaveBeenCalled();
      expect(organisationServiceService.addOrganisationServiceToCollectionIfMissing).toHaveBeenCalledWith(
        organisationServiceCollection,
        ...additionalOrganisationServices
      );
      expect(comp.organisationServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AuthInterface query and add missing value', () => {
      const organisation: IOrganisation = { id: 456 };
      const interfaces: IAuthInterface[] = [{ id: 18554 }];
      organisation.interfaces = interfaces;

      const authInterfaceCollection: IAuthInterface[] = [{ id: 64483 }];
      jest.spyOn(authInterfaceService, 'query').mockReturnValue(of(new HttpResponse({ body: authInterfaceCollection })));
      const additionalAuthInterfaces = [...interfaces];
      const expectedCollection: IAuthInterface[] = [...additionalAuthInterfaces, ...authInterfaceCollection];
      jest.spyOn(authInterfaceService, 'addAuthInterfaceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      expect(authInterfaceService.query).toHaveBeenCalled();
      expect(authInterfaceService.addAuthInterfaceToCollectionIfMissing).toHaveBeenCalledWith(
        authInterfaceCollection,
        ...additionalAuthInterfaces
      );
      expect(comp.authInterfacesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organisation: IOrganisation = { id: 456 };
      const subscriptions: IBundle = { id: 26604 };
      organisation.subscriptions = subscriptions;
      const userdatas: IUserData = { id: 43020 };
      organisation.userdatas = userdatas;
      const services: IOrganisationService = { id: 88410 };
      organisation.services = [services];
      const interfaces: IAuthInterface = { id: 15962 };
      organisation.interfaces = [interfaces];

      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organisation));
      expect(comp.bundlesSharedCollection).toContain(subscriptions);
      expect(comp.userDataSharedCollection).toContain(userdatas);
      expect(comp.organisationServicesSharedCollection).toContain(services);
      expect(comp.authInterfacesSharedCollection).toContain(interfaces);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Organisation>>();
      const organisation = { id: 123 };
      jest.spyOn(organisationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organisation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organisationService.update).toHaveBeenCalledWith(organisation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Organisation>>();
      const organisation = new Organisation();
      jest.spyOn(organisationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organisation }));
      saveSubject.complete();

      // THEN
      expect(organisationService.create).toHaveBeenCalledWith(organisation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Organisation>>();
      const organisation = { id: 123 };
      jest.spyOn(organisationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organisation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organisationService.update).toHaveBeenCalledWith(organisation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBundleById', () => {
      it('Should return tracked Bundle primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBundleById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserDataById', () => {
      it('Should return tracked UserData primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserDataById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOrganisationServiceById', () => {
      it('Should return tracked OrganisationService primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrganisationServiceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAuthInterfaceById', () => {
      it('Should return tracked AuthInterface primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAuthInterfaceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedOrganisationService', () => {
      it('Should return option if no OrganisationService is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedOrganisationService(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected OrganisationService for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedOrganisationService(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this OrganisationService is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedOrganisationService(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedAuthInterface', () => {
      it('Should return option if no AuthInterface is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedAuthInterface(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected AuthInterface for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedAuthInterface(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this AuthInterface is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedAuthInterface(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
