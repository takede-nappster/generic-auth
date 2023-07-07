import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOrganisationService, OrganisationService } from '../organisation-service.model';
import { OrganisationServiceService } from '../service/organisation-service.service';

import { OrganisationServiceRoutingResolveService } from './organisation-service-routing-resolve.service';

describe('OrganisationService routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OrganisationServiceRoutingResolveService;
  let service: OrganisationServiceService;
  let resultOrganisationService: IOrganisationService | undefined;

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
    routingResolveService = TestBed.inject(OrganisationServiceRoutingResolveService);
    service = TestBed.inject(OrganisationServiceService);
    resultOrganisationService = undefined;
  });

  describe('resolve', () => {
    it('should return IOrganisationService returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganisationService = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganisationService).toEqual({ id: 123 });
    });

    it('should return new IOrganisationService if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganisationService = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOrganisationService).toEqual(new OrganisationService());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OrganisationService })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganisationService = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganisationService).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
