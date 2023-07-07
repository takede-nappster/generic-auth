import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrganisationServiceService } from '../service/organisation-service.service';
import { IOrganisationService, OrganisationService } from '../organisation-service.model';
import { IUserInfo } from 'app/entities/user-info/user-info.model';
import { UserInfoService } from 'app/entities/user-info/service/user-info.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';

import { OrganisationServiceUpdateComponent } from './organisation-service-update.component';

describe('OrganisationService Management Update Component', () => {
  let comp: OrganisationServiceUpdateComponent;
  let fixture: ComponentFixture<OrganisationServiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organisationServiceService: OrganisationServiceService;
  let userInfoService: UserInfoService;
  let groupeService: GroupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrganisationServiceUpdateComponent],
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
      .overrideTemplate(OrganisationServiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganisationServiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organisationServiceService = TestBed.inject(OrganisationServiceService);
    userInfoService = TestBed.inject(UserInfoService);
    groupeService = TestBed.inject(GroupeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserInfo query and add missing value', () => {
      const organisationService: IOrganisationService = { id: 456 };
      const members: IUserInfo[] = [{ id: 41921 }];
      organisationService.members = members;

      const userInfoCollection: IUserInfo[] = [{ id: 90638 }];
      jest.spyOn(userInfoService, 'query').mockReturnValue(of(new HttpResponse({ body: userInfoCollection })));
      const additionalUserInfos = [...members];
      const expectedCollection: IUserInfo[] = [...additionalUserInfos, ...userInfoCollection];
      jest.spyOn(userInfoService, 'addUserInfoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organisationService });
      comp.ngOnInit();

      expect(userInfoService.query).toHaveBeenCalled();
      expect(userInfoService.addUserInfoToCollectionIfMissing).toHaveBeenCalledWith(userInfoCollection, ...additionalUserInfos);
      expect(comp.userInfosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Groupe query and add missing value', () => {
      const organisationService: IOrganisationService = { id: 456 };
      const groups: IGroupe[] = [{ id: 38810 }];
      organisationService.groups = groups;

      const groupeCollection: IGroupe[] = [{ id: 80036 }];
      jest.spyOn(groupeService, 'query').mockReturnValue(of(new HttpResponse({ body: groupeCollection })));
      const additionalGroupes = [...groups];
      const expectedCollection: IGroupe[] = [...additionalGroupes, ...groupeCollection];
      jest.spyOn(groupeService, 'addGroupeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organisationService });
      comp.ngOnInit();

      expect(groupeService.query).toHaveBeenCalled();
      expect(groupeService.addGroupeToCollectionIfMissing).toHaveBeenCalledWith(groupeCollection, ...additionalGroupes);
      expect(comp.groupesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organisationService: IOrganisationService = { id: 456 };
      const members: IUserInfo = { id: 21011 };
      organisationService.members = [members];
      const groups: IGroupe = { id: 95000 };
      organisationService.groups = [groups];

      activatedRoute.data = of({ organisationService });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organisationService));
      expect(comp.userInfosSharedCollection).toContain(members);
      expect(comp.groupesSharedCollection).toContain(groups);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganisationService>>();
      const organisationService = { id: 123 };
      jest.spyOn(organisationServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organisationService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organisationService }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organisationServiceService.update).toHaveBeenCalledWith(organisationService);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganisationService>>();
      const organisationService = new OrganisationService();
      jest.spyOn(organisationServiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organisationService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organisationService }));
      saveSubject.complete();

      // THEN
      expect(organisationServiceService.create).toHaveBeenCalledWith(organisationService);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganisationService>>();
      const organisationService = { id: 123 };
      jest.spyOn(organisationServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organisationService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organisationServiceService.update).toHaveBeenCalledWith(organisationService);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserInfoById', () => {
      it('Should return tracked UserInfo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserInfoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackGroupeById', () => {
      it('Should return tracked Groupe primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackGroupeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedUserInfo', () => {
      it('Should return option if no UserInfo is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedUserInfo(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected UserInfo for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedUserInfo(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this UserInfo is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedUserInfo(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedGroupe', () => {
      it('Should return option if no Groupe is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedGroupe(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Groupe for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedGroupe(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Groupe is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedGroupe(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
