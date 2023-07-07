import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInterfaceParam, InterfaceParam } from '../interface-param.model';

import { InterfaceParamService } from './interface-param.service';

describe('InterfaceParam Service', () => {
  let service: InterfaceParamService;
  let httpMock: HttpTestingController;
  let elemDefault: IInterfaceParam;
  let expectedResult: IInterfaceParam | IInterfaceParam[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InterfaceParamService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      value: 'AAAAAAA',
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

    it('should create a InterfaceParam', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new InterfaceParam()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InterfaceParam', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          value: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InterfaceParam', () => {
      const patchObject = Object.assign(
        {
          value: 'BBBBBB',
        },
        new InterfaceParam()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InterfaceParam', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          value: 'BBBBBB',
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

    it('should delete a InterfaceParam', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addInterfaceParamToCollectionIfMissing', () => {
      it('should add a InterfaceParam to an empty array', () => {
        const interfaceParam: IInterfaceParam = { id: 123 };
        expectedResult = service.addInterfaceParamToCollectionIfMissing([], interfaceParam);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(interfaceParam);
      });

      it('should not add a InterfaceParam to an array that contains it', () => {
        const interfaceParam: IInterfaceParam = { id: 123 };
        const interfaceParamCollection: IInterfaceParam[] = [
          {
            ...interfaceParam,
          },
          { id: 456 },
        ];
        expectedResult = service.addInterfaceParamToCollectionIfMissing(interfaceParamCollection, interfaceParam);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InterfaceParam to an array that doesn't contain it", () => {
        const interfaceParam: IInterfaceParam = { id: 123 };
        const interfaceParamCollection: IInterfaceParam[] = [{ id: 456 }];
        expectedResult = service.addInterfaceParamToCollectionIfMissing(interfaceParamCollection, interfaceParam);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(interfaceParam);
      });

      it('should add only unique InterfaceParam to an array', () => {
        const interfaceParamArray: IInterfaceParam[] = [{ id: 123 }, { id: 456 }, { id: 87693 }];
        const interfaceParamCollection: IInterfaceParam[] = [{ id: 123 }];
        expectedResult = service.addInterfaceParamToCollectionIfMissing(interfaceParamCollection, ...interfaceParamArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const interfaceParam: IInterfaceParam = { id: 123 };
        const interfaceParam2: IInterfaceParam = { id: 456 };
        expectedResult = service.addInterfaceParamToCollectionIfMissing([], interfaceParam, interfaceParam2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(interfaceParam);
        expect(expectedResult).toContain(interfaceParam2);
      });

      it('should accept null and undefined values', () => {
        const interfaceParam: IInterfaceParam = { id: 123 };
        expectedResult = service.addInterfaceParamToCollectionIfMissing([], null, interfaceParam, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(interfaceParam);
      });

      it('should return initial array if no InterfaceParam is added', () => {
        const interfaceParamCollection: IInterfaceParam[] = [{ id: 123 }];
        expectedResult = service.addInterfaceParamToCollectionIfMissing(interfaceParamCollection, undefined, null);
        expect(expectedResult).toEqual(interfaceParamCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
