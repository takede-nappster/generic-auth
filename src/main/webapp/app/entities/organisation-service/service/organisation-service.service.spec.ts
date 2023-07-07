import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrganisationService, OrganisationService } from '../organisation-service.model';

import { OrganisationServiceService } from './organisation-service.service';

describe('OrganisationService Service', () => {
  let service: OrganisationServiceService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganisationService;
  let expectedResult: IOrganisationService | IOrganisationService[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganisationServiceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a OrganisationService', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new OrganisationService()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganisationService', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrganisationService', () => {
      const patchObject = Object.assign({}, new OrganisationService());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrganisationService', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a OrganisationService', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganisationServiceToCollectionIfMissing', () => {
      it('should add a OrganisationService to an empty array', () => {
        const organisationService: IOrganisationService = { id: 123 };
        expectedResult = service.addOrganisationServiceToCollectionIfMissing([], organisationService);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organisationService);
      });

      it('should not add a OrganisationService to an array that contains it', () => {
        const organisationService: IOrganisationService = { id: 123 };
        const organisationServiceCollection: IOrganisationService[] = [
          {
            ...organisationService,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganisationServiceToCollectionIfMissing(organisationServiceCollection, organisationService);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganisationService to an array that doesn't contain it", () => {
        const organisationService: IOrganisationService = { id: 123 };
        const organisationServiceCollection: IOrganisationService[] = [{ id: 456 }];
        expectedResult = service.addOrganisationServiceToCollectionIfMissing(organisationServiceCollection, organisationService);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organisationService);
      });

      it('should add only unique OrganisationService to an array', () => {
        const organisationServiceArray: IOrganisationService[] = [{ id: 123 }, { id: 456 }, { id: 32488 }];
        const organisationServiceCollection: IOrganisationService[] = [{ id: 123 }];
        expectedResult = service.addOrganisationServiceToCollectionIfMissing(organisationServiceCollection, ...organisationServiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organisationService: IOrganisationService = { id: 123 };
        const organisationService2: IOrganisationService = { id: 456 };
        expectedResult = service.addOrganisationServiceToCollectionIfMissing([], organisationService, organisationService2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organisationService);
        expect(expectedResult).toContain(organisationService2);
      });

      it('should accept null and undefined values', () => {
        const organisationService: IOrganisationService = { id: 123 };
        expectedResult = service.addOrganisationServiceToCollectionIfMissing([], null, organisationService, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organisationService);
      });

      it('should return initial array if no OrganisationService is added', () => {
        const organisationServiceCollection: IOrganisationService[] = [{ id: 123 }];
        expectedResult = service.addOrganisationServiceToCollectionIfMissing(organisationServiceCollection, undefined, null);
        expect(expectedResult).toEqual(organisationServiceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
