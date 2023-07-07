import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserInfoDetailComponent } from './user-info-detail.component';

describe('UserInfo Management Detail Component', () => {
  let comp: UserInfoDetailComponent;
  let fixture: ComponentFixture<UserInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
