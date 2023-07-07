import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InterfaceParamService } from '../service/interface-param.service';
import { IInterfaceParam, InterfaceParam } from '../interface-param.model';

import { InterfaceParamUpdateComponent } from './interface-param-update.component';

describe('InterfaceParam Management Update Component', () => {
  let comp: InterfaceParamUpdateComponent;
  let fixture: ComponentFixture<InterfaceParamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let interfaceParamService: InterfaceParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InterfaceParamUpdateComponent],
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
      .overrideTemplate(InterfaceParamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InterfaceParamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    interfaceParamService = TestBed.inject(InterfaceParamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const interfaceParam: IInterfaceParam = { id: 456 };

      activatedRoute.data = of({ interfaceParam });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(interfaceParam));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<InterfaceParam>>();
      const interfaceParam = { id: 123 };
      jest.spyOn(interfaceParamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interfaceParam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: interfaceParam }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(interfaceParamService.update).toHaveBeenCalledWith(interfaceParam);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<InterfaceParam>>();
      const interfaceParam = new InterfaceParam();
      jest.spyOn(interfaceParamService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interfaceParam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: interfaceParam }));
      saveSubject.complete();

      // THEN
      expect(interfaceParamService.create).toHaveBeenCalledWith(interfaceParam);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<InterfaceParam>>();
      const interfaceParam = { id: 123 };
      jest.spyOn(interfaceParamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interfaceParam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(interfaceParamService.update).toHaveBeenCalledWith(interfaceParam);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
