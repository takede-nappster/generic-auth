import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdditionalDataDetailComponent } from './additional-data-detail.component';

describe('AdditionalData Management Detail Component', () => {
  let comp: AdditionalDataDetailComponent;
  let fixture: ComponentFixture<AdditionalDataDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalDataDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ additionalData: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdditionalDataDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdditionalDataDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load additionalData on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.additionalData).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
