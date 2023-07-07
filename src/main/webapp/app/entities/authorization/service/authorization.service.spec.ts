import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAuthorization, Authorization } from '../authorization.model';

import { AuthorizationService } from './authorization.service';

describe('Authorization Service', () => {
  let service: AuthorizationService;
  let httpMock: HttpTestingController;
  let elemDefault: IAuthorization;
  let expectedResult: IAuthorization | IAuthorization[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AuthorizationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      code: 'AAAAAAA',
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

    it('should create a Authorization', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Authorization()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Authorization', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          code: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Authorization', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          code: 'BBBBBB',
        },
        new Authorization()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Authorization', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          code: 'BBBBBB',
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

    it('should delete a Authorization', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAuthorizationToCollectionIfMissing', () => {
      it('should add a Authorization to an empty array', () => {
        const authorization: IAuthorization = { id: 123 };
        expectedResult = service.addAuthorizationToCollectionIfMissing([], authorization);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authorization);
      });

      it('should not add a Authorization to an array that contains it', () => {
        const authorization: IAuthorization = { id: 123 };
        const authorizationCollection: IAuthorization[] = [
          {
            ...authorization,
          },
          { id: 456 },
        ];
        expectedResult = service.addAuthorizationToCollectionIfMissing(authorizationCollection, authorization);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Authorization to an array that doesn't contain it", () => {
        const authorization: IAuthorization = { id: 123 };
        const authorizationCollection: IAuthorization[] = [{ id: 456 }];
        expectedResult = service.addAuthorizationToCollectionIfMissing(authorizationCollection, authorization);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authorization);
      });

      it('should add only unique Authorization to an array', () => {
        const authorizationArray: IAuthorization[] = [{ id: 123 }, { id: 456 }, { id: 92752 }];
        const authorizationCollection: IAuthorization[] = [{ id: 123 }];
        expectedResult = service.addAuthorizationToCollectionIfMissing(authorizationCollection, ...authorizationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const authorization: IAuthorization = { id: 123 };
        const authorization2: IAuthorization = { id: 456 };
        expectedResult = service.addAuthorizationToCollectionIfMissing([], authorization, authorization2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authorization);
        expect(expectedResult).toContain(authorization2);
      });

      it('should accept null and undefined values', () => {
        const authorization: IAuthorization = { id: 123 };
        expectedResult = service.addAuthorizationToCollectionIfMissing([], null, authorization, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authorization);
      });

      it('should return initial array if no Authorization is added', () => {
        const authorizationCollection: IAuthorization[] = [{ id: 123 }];
        expectedResult = service.addAuthorizationToCollectionIfMissing(authorizationCollection, undefined, null);
        expect(expectedResult).toEqual(authorizationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
