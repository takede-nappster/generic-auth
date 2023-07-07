import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserInfoService } from '../service/user-info.service';
import { IUserInfo, UserInfo } from '../user-info.model';
import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';
import { IAdditionalData } from 'app/entities/additional-data/additional-data.model';
import { AdditionalDataService } from 'app/entities/additional-data/service/additional-data.service';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';

import { UserInfoUpdateComponent } from './user-info-update.component';

describe('UserInfo Management Update Component', () => {
  let comp: UserInfoUpdateComponent;
  let fixture: ComponentFixture<UserInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userInfoService: UserInfoService;
  let roleService: RoleService;
  let groupeService: GroupeService;
  let additionalDataService: AdditionalDataService;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserInfoUpdateComponent],
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
      .overrideTemplate(UserInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userInfoService = TestBed.inject(UserInfoService);
    roleService = TestBed.inject(RoleService);
    groupeService = TestBed.inject(GroupeService);
    additionalDataService = TestBed.inject(AdditionalDataService);
    sessionService = TestBed.inject(SessionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Role query and add missing value', () => {
      const userInfo: IUserInfo = { id: 456 };
      const roles: IRole = { id: 67398 };
      userInfo.roles = roles;

      const roleCollection: IRole[] = [{ id: 34331 }];
      jest.spyOn(roleService, 'query').mockReturnValue(of(new HttpResponse({ body: roleCollection })));
      const additionalRoles = [roles];
      const expectedCollection: IRole[] = [...additionalRoles, ...roleCollection];
      jest.spyOn(roleService, 'addRoleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(roleService.query).toHaveBeenCalled();
      expect(roleService.addRoleToCollectionIfMissing).toHaveBeenCalledWith(roleCollection, ...additionalRoles);
      expect(comp.rolesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Groupe query and add missing value', () => {
      const userInfo: IUserInfo = { id: 456 };
      const groupes: IGroupe = { id: 46032 };
      userInfo.groupes = groupes;

      const groupeCollection: IGroupe[] = [{ id: 34049 }];
      jest.spyOn(groupeService, 'query').mockReturnValue(of(new HttpResponse({ body: groupeCollection })));
      const additionalGroupes = [groupes];
      const expectedCollection: IGroupe[] = [...additionalGroupes, ...groupeCollection];
      jest.spyOn(groupeService, 'addGroupeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(groupeService.query).toHaveBeenCalled();
      expect(groupeService.addGroupeToCollectionIfMissing).toHaveBeenCalledWith(groupeCollection, ...additionalGroupes);
      expect(comp.groupesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AdditionalData query and add missing value', () => {
      const userInfo: IUserInfo = { id: 456 };
      const additionalDatas: IAdditionalData[] = [{ id: 3672 }];
      userInfo.additionalDatas = additionalDatas;

      const additionalDataCollection: IAdditionalData[] = [{ id: 27267 }];
      jest.spyOn(additionalDataService, 'query').mockReturnValue(of(new HttpResponse({ body: additionalDataCollection })));
      const additionalAdditionalData = [...additionalDatas];
      const expectedCollection: IAdditionalData[] = [...additionalAdditionalData, ...additionalDataCollection];
      jest.spyOn(additionalDataService, 'addAdditionalDataToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(additionalDataService.query).toHaveBeenCalled();
      expect(additionalDataService.addAdditionalDataToCollectionIfMissing).toHaveBeenCalledWith(
        additionalDataCollection,
        ...additionalAdditionalData
      );
      expect(comp.additionalDataSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Session query and add missing value', () => {
      const userInfo: IUserInfo = { id: 456 };
      const sessions: ISession[] = [{ id: 85719 }];
      userInfo.sessions = sessions;

      const sessionCollection: ISession[] = [{ id: 55135 }];
      jest.spyOn(sessionService, 'query').mockReturnValue(of(new HttpResponse({ body: sessionCollection })));
      const additionalSessions = [...sessions];
      const expectedCollection: ISession[] = [...additionalSessions, ...sessionCollection];
      jest.spyOn(sessionService, 'addSessionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(sessionService.query).toHaveBeenCalled();
      expect(sessionService.addSessionToCollectionIfMissing).toHaveBeenCalledWith(sessionCollection, ...additionalSessions);
      expect(comp.sessionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userInfo: IUserInfo = { id: 456 };
      const roles: IRole = { id: 19306 };
      userInfo.roles = roles;
      const groupes: IGroupe = { id: 74413 };
      userInfo.groupes = groupes;
      const additionalDatas: IAdditionalData = { id: 49448 };
      userInfo.additionalDatas = [additionalDatas];
      const sessions: ISession = { id: 5971 };
      userInfo.sessions = [sessions];

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userInfo));
      expect(comp.rolesSharedCollection).toContain(roles);
      expect(comp.groupesSharedCollection).toContain(groupes);
      expect(comp.additionalDataSharedCollection).toContain(additionalDatas);
      expect(comp.sessionsSharedCollection).toContain(sessions);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserInfo>>();
      const userInfo = { id: 123 };
      jest.spyOn(userInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userInfo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userInfoService.update).toHaveBeenCalledWith(userInfo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserInfo>>();
      const userInfo = new UserInfo();
      jest.spyOn(userInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userInfo }));
      saveSubject.complete();

      // THEN
      expect(userInfoService.create).toHaveBeenCalledWith(userInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserInfo>>();
      const userInfo = { id: 123 };
      jest.spyOn(userInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userInfoService.update).toHaveBeenCalledWith(userInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRoleById', () => {
      it('Should return tracked Role primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRoleById(0, entity);
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

    describe('trackAdditionalDataById', () => {
      it('Should return tracked AdditionalData primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAdditionalDataById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSessionById', () => {
      it('Should return tracked Session primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSessionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedAdditionalData', () => {
      it('Should return option if no AdditionalData is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedAdditionalData(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected AdditionalData for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedAdditionalData(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this AdditionalData is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedAdditionalData(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedSession', () => {
      it('Should return option if no Session is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedSession(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Session for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedSession(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Session is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedSession(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
