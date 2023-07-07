import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BundleDetailComponent } from './bundle-detail.component';

describe('Bundle Management Detail Component', () => {
  let comp: BundleDetailComponent;
  let fixture: ComponentFixture<BundleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bundle: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BundleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BundleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bundle on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bundle).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
