import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InterfaceParamDetailComponent } from './interface-param-detail.component';

describe('InterfaceParam Management Detail Component', () => {
  let comp: InterfaceParamDetailComponent;
  let fixture: ComponentFixture<InterfaceParamDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterfaceParamDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ interfaceParam: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InterfaceParamDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InterfaceParamDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load interfaceParam on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.interfaceParam).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
