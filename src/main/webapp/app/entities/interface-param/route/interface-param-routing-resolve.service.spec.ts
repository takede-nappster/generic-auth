import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IInterfaceParam, InterfaceParam } from '../interface-param.model';
import { InterfaceParamService } from '../service/interface-param.service';

import { InterfaceParamRoutingResolveService } from './interface-param-routing-resolve.service';

describe('InterfaceParam routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: InterfaceParamRoutingResolveService;
  let service: InterfaceParamService;
  let resultInterfaceParam: IInterfaceParam | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(InterfaceParamRoutingResolveService);
    service = TestBed.inject(InterfaceParamService);
    resultInterfaceParam = undefined;
  });

  describe('resolve', () => {
    it('should return IInterfaceParam returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultInterfaceParam = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultInterfaceParam).toEqual({ id: 123 });
    });

    it('should return new IInterfaceParam if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultInterfaceParam = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultInterfaceParam).toEqual(new InterfaceParam());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as InterfaceParam })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultInterfaceParam = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultInterfaceParam).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
