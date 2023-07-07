import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AuthInterfaceService } from '../service/auth-interface.service';
import { IAuthInterface, AuthInterface } from '../auth-interface.model';
import { IInterfaceParam } from 'app/entities/interface-param/interface-param.model';
import { InterfaceParamService } from 'app/entities/interface-param/service/interface-param.service';

import { AuthInterfaceUpdateComponent } from './auth-interface-update.component';

describe('AuthInterface Management Update Component', () => {
  let comp: AuthInterfaceUpdateComponent;
  let fixture: ComponentFixture<AuthInterfaceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let authInterfaceService: AuthInterfaceService;
  let interfaceParamService: InterfaceParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AuthInterfaceUpdateComponent],
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
      .overrideTemplate(AuthInterfaceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthInterfaceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    authInterfaceService = TestBed.inject(AuthInterfaceService);
    interfaceParamService = TestBed.inject(InterfaceParamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call InterfaceParam query and add missing value', () => {
      const authInterface: IAuthInterface = { id: 456 };
      const prams: IInterfaceParam = { id: 25933 };
      authInterface.prams = prams;

      const interfaceParamCollection: IInterfaceParam[] = [{ id: 3671 }];
      jest.spyOn(interfaceParamService, 'query').mockReturnValue(of(new HttpResponse({ body: interfaceParamCollection })));
      const additionalInterfaceParams = [prams];
      const expectedCollection: IInterfaceParam[] = [...additionalInterfaceParams, ...interfaceParamCollection];
      jest.spyOn(interfaceParamService, 'addInterfaceParamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ authInterface });
      comp.ngOnInit();

      expect(interfaceParamService.query).toHaveBeenCalled();
      expect(interfaceParamService.addInterfaceParamToCollectionIfMissing).toHaveBeenCalledWith(
        interfaceParamCollection,
        ...additionalInterfaceParams
      );
      expect(comp.interfaceParamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const authInterface: IAuthInterface = { id: 456 };
      const prams: IInterfaceParam = { id: 24891 };
      authInterface.prams = prams;

      activatedRoute.data = of({ authInterface });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(authInterface));
      expect(comp.interfaceParamsSharedCollection).toContain(prams);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AuthInterface>>();
      const authInterface = { id: 123 };
      jest.spyOn(authInterfaceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authInterface });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authInterface }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(authInterfaceService.update).toHaveBeenCalledWith(authInterface);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AuthInterface>>();
      const authInterface = new AuthInterface();
      jest.spyOn(authInterfaceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authInterface });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authInterface }));
      saveSubject.complete();

      // THEN
      expect(authInterfaceService.create).toHaveBeenCalledWith(authInterface);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AuthInterface>>();
      const authInterface = { id: 123 };
      jest.spyOn(authInterfaceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authInterface });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(authInterfaceService.update).toHaveBeenCalledWith(authInterface);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackInterfaceParamById', () => {
      it('Should return tracked InterfaceParam primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackInterfaceParamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
