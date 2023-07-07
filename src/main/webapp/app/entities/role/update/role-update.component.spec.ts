import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoleService } from '../service/role.service';
import { IRole, Role } from '../role.model';
import { IAuthorization } from 'app/entities/authorization/authorization.model';
import { AuthorizationService } from 'app/entities/authorization/service/authorization.service';

import { RoleUpdateComponent } from './role-update.component';

describe('Role Management Update Component', () => {
  let comp: RoleUpdateComponent;
  let fixture: ComponentFixture<RoleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roleService: RoleService;
  let authorizationService: AuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoleUpdateComponent],
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
      .overrideTemplate(RoleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roleService = TestBed.inject(RoleService);
    authorizationService = TestBed.inject(AuthorizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Authorization query and add missing value', () => {
      const role: IRole = { id: 456 };
      const authrizations: IAuthorization = { id: 26019 };
      role.authrizations = authrizations;

      const authorizationCollection: IAuthorization[] = [{ id: 32198 }];
      jest.spyOn(authorizationService, 'query').mockReturnValue(of(new HttpResponse({ body: authorizationCollection })));
      const additionalAuthorizations = [authrizations];
      const expectedCollection: IAuthorization[] = [...additionalAuthorizations, ...authorizationCollection];
      jest.spyOn(authorizationService, 'addAuthorizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ role });
      comp.ngOnInit();

      expect(authorizationService.query).toHaveBeenCalled();
      expect(authorizationService.addAuthorizationToCollectionIfMissing).toHaveBeenCalledWith(
        authorizationCollection,
        ...additionalAuthorizations
      );
      expect(comp.authorizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const role: IRole = { id: 456 };
      const authrizations: IAuthorization = { id: 90113 };
      role.authrizations = authrizations;

      activatedRoute.data = of({ role });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(role));
      expect(comp.authorizationsSharedCollection).toContain(authrizations);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Role>>();
      const role = { id: 123 };
      jest.spyOn(roleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ role });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: role }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(roleService.update).toHaveBeenCalledWith(role);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Role>>();
      const role = new Role();
      jest.spyOn(roleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ role });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: role }));
      saveSubject.complete();

      // THEN
      expect(roleService.create).toHaveBeenCalledWith(role);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Role>>();
      const role = { id: 123 };
      jest.spyOn(roleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ role });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roleService.update).toHaveBeenCalledWith(role);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAuthorizationById', () => {
      it('Should return tracked Authorization primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAuthorizationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
