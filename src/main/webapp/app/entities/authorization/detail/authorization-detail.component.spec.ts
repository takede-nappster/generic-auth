import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuthorizationDetailComponent } from './authorization-detail.component';

describe('Authorization Management Detail Component', () => {
  let comp: AuthorizationDetailComponent;
  let fixture: ComponentFixture<AuthorizationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ authorization: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AuthorizationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AuthorizationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load authorization on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.authorization).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
