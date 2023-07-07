import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAuthInterface, AuthInterface } from '../auth-interface.model';
import { AuthInterfaceService } from '../service/auth-interface.service';

import { AuthInterfaceRoutingResolveService } from './auth-interface-routing-resolve.service';

describe('AuthInterface routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AuthInterfaceRoutingResolveService;
  let service: AuthInterfaceService;
  let resultAuthInterface: IAuthInterface | undefined;

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
    routingResolveService = TestBed.inject(AuthInterfaceRoutingResolveService);
    service = TestBed.inject(AuthInterfaceService);
    resultAuthInterface = undefined;
  });

  describe('resolve', () => {
    it('should return IAuthInterface returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAuthInterface = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAuthInterface).toEqual({ id: 123 });
    });

    it('should return new IAuthInterface if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAuthInterface = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAuthInterface).toEqual(new AuthInterface());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AuthInterface })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAuthInterface = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAuthInterface).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
