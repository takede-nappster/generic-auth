import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AuthorizationService } from '../service/authorization.service';
import { IAuthorization, Authorization } from '../authorization.model';

import { AuthorizationUpdateComponent } from './authorization-update.component';

describe('Authorization Management Update Component', () => {
  let comp: AuthorizationUpdateComponent;
  let fixture: ComponentFixture<AuthorizationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let authorizationService: AuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AuthorizationUpdateComponent],
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
      .overrideTemplate(AuthorizationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthorizationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    authorizationService = TestBed.inject(AuthorizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const authorization: IAuthorization = { id: 456 };

      activatedRoute.data = of({ authorization });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(authorization));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Authorization>>();
      const authorization = { id: 123 };
      jest.spyOn(authorizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authorization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authorization }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(authorizationService.update).toHaveBeenCalledWith(authorization);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Authorization>>();
      const authorization = new Authorization();
      jest.spyOn(authorizationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authorization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authorization }));
      saveSubject.complete();

      // THEN
      expect(authorizationService.create).toHaveBeenCalledWith(authorization);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Authorization>>();
      const authorization = { id: 123 };
      jest.spyOn(authorizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authorization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(authorizationService.update).toHaveBeenCalledWith(authorization);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
