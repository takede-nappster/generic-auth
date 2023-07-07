import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuthInterfaceDetailComponent } from './auth-interface-detail.component';

describe('AuthInterface Management Detail Component', () => {
  let comp: AuthInterfaceDetailComponent;
  let fixture: ComponentFixture<AuthInterfaceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthInterfaceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ authInterface: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AuthInterfaceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AuthInterfaceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load authInterface on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.authInterface).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
