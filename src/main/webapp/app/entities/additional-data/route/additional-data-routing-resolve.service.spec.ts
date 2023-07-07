import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAdditionalData, AdditionalData } from '../additional-data.model';
import { AdditionalDataService } from '../service/additional-data.service';

import { AdditionalDataRoutingResolveService } from './additional-data-routing-resolve.service';

describe('AdditionalData routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AdditionalDataRoutingResolveService;
  let service: AdditionalDataService;
  let resultAdditionalData: IAdditionalData | undefined;

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
    routingResolveService = TestBed.inject(AdditionalDataRoutingResolveService);
    service = TestBed.inject(AdditionalDataService);
    resultAdditionalData = undefined;
  });

  describe('resolve', () => {
    it('should return IAdditionalData returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdditionalData = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAdditionalData).toEqual({ id: 123 });
    });

    it('should return new IAdditionalData if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdditionalData = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAdditionalData).toEqual(new AdditionalData());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AdditionalData })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdditionalData = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAdditionalData).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
