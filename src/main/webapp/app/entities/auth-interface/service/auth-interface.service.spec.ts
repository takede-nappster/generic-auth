import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAuthInterface, AuthInterface } from '../auth-interface.model';

import { AuthInterfaceService } from './auth-interface.service';

describe('AuthInterface Service', () => {
  let service: AuthInterfaceService;
  let httpMock: HttpTestingController;
  let elemDefault: IAuthInterface;
  let expectedResult: IAuthInterface | IAuthInterface[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AuthInterfaceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      url: 'AAAAAAA',
      driverName: 'AAAAAAA',
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

    it('should create a AuthInterface', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AuthInterface()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AuthInterface', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          url: 'BBBBBB',
          driverName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AuthInterface', () => {
      const patchObject = Object.assign({}, new AuthInterface());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AuthInterface', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          url: 'BBBBBB',
          driverName: 'BBBBBB',
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

    it('should delete a AuthInterface', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAuthInterfaceToCollectionIfMissing', () => {
      it('should add a AuthInterface to an empty array', () => {
        const authInterface: IAuthInterface = { id: 123 };
        expectedResult = service.addAuthInterfaceToCollectionIfMissing([], authInterface);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authInterface);
      });

      it('should not add a AuthInterface to an array that contains it', () => {
        const authInterface: IAuthInterface = { id: 123 };
        const authInterfaceCollection: IAuthInterface[] = [
          {
            ...authInterface,
          },
          { id: 456 },
        ];
        expectedResult = service.addAuthInterfaceToCollectionIfMissing(authInterfaceCollection, authInterface);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AuthInterface to an array that doesn't contain it", () => {
        const authInterface: IAuthInterface = { id: 123 };
        const authInterfaceCollection: IAuthInterface[] = [{ id: 456 }];
        expectedResult = service.addAuthInterfaceToCollectionIfMissing(authInterfaceCollection, authInterface);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authInterface);
      });

      it('should add only unique AuthInterface to an array', () => {
        const authInterfaceArray: IAuthInterface[] = [{ id: 123 }, { id: 456 }, { id: 20413 }];
        const authInterfaceCollection: IAuthInterface[] = [{ id: 123 }];
        expectedResult = service.addAuthInterfaceToCollectionIfMissing(authInterfaceCollection, ...authInterfaceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const authInterface: IAuthInterface = { id: 123 };
        const authInterface2: IAuthInterface = { id: 456 };
        expectedResult = service.addAuthInterfaceToCollectionIfMissing([], authInterface, authInterface2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authInterface);
        expect(expectedResult).toContain(authInterface2);
      });

      it('should accept null and undefined values', () => {
        const authInterface: IAuthInterface = { id: 123 };
        expectedResult = service.addAuthInterfaceToCollectionIfMissing([], null, authInterface, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authInterface);
      });

      it('should return initial array if no AuthInterface is added', () => {
        const authInterfaceCollection: IAuthInterface[] = [{ id: 123 }];
        expectedResult = service.addAuthInterfaceToCollectionIfMissing(authInterfaceCollection, undefined, null);
        expect(expectedResult).toEqual(authInterfaceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
