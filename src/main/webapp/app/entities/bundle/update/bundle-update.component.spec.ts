import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BundleService } from '../service/bundle.service';
import { IBundle, Bundle } from '../bundle.model';

import { BundleUpdateComponent } from './bundle-update.component';

describe('Bundle Management Update Component', () => {
  let comp: BundleUpdateComponent;
  let fixture: ComponentFixture<BundleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bundleService: BundleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BundleUpdateComponent],
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
      .overrideTemplate(BundleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BundleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bundleService = TestBed.inject(BundleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bundle: IBundle = { id: 456 };

      activatedRoute.data = of({ bundle });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bundle));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bundle>>();
      const bundle = { id: 123 };
      jest.spyOn(bundleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bundle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bundle }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bundleService.update).toHaveBeenCalledWith(bundle);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bundle>>();
      const bundle = new Bundle();
      jest.spyOn(bundleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bundle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bundle }));
      saveSubject.complete();

      // THEN
      expect(bundleService.create).toHaveBeenCalledWith(bundle);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bundle>>();
      const bundle = { id: 123 };
      jest.spyOn(bundleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bundle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bundleService.update).toHaveBeenCalledWith(bundle);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
