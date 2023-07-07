import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdditionalDataService } from '../service/additional-data.service';
import { IAdditionalData, AdditionalData } from '../additional-data.model';

import { AdditionalDataUpdateComponent } from './additional-data-update.component';

describe('AdditionalData Management Update Component', () => {
  let comp: AdditionalDataUpdateComponent;
  let fixture: ComponentFixture<AdditionalDataUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let additionalDataService: AdditionalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdditionalDataUpdateComponent],
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
      .overrideTemplate(AdditionalDataUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdditionalDataUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    additionalDataService = TestBed.inject(AdditionalDataService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const additionalData: IAdditionalData = { id: 456 };

      activatedRoute.data = of({ additionalData });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(additionalData));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdditionalData>>();
      const additionalData = { id: 123 };
      jest.spyOn(additionalDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ additionalData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: additionalData }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(additionalDataService.update).toHaveBeenCalledWith(additionalData);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdditionalData>>();
      const additionalData = new AdditionalData();
      jest.spyOn(additionalDataService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ additionalData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: additionalData }));
      saveSubject.complete();

      // THEN
      expect(additionalDataService.create).toHaveBeenCalledWith(additionalData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdditionalData>>();
      const additionalData = { id: 123 };
      jest.spyOn(additionalDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ additionalData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(additionalDataService.update).toHaveBeenCalledWith(additionalData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
