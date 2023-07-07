import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganisationServiceDetailComponent } from './organisation-service-detail.component';

describe('OrganisationService Management Detail Component', () => {
  let comp: OrganisationServiceDetailComponent;
  let fixture: ComponentFixture<OrganisationServiceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationServiceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organisationService: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganisationServiceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganisationServiceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organisationService on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organisationService).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
