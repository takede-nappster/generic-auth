import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdditionalData, AdditionalData } from '../additional-data.model';

import { AdditionalDataService } from './additional-data.service';

describe('AdditionalData Service', () => {
  let service: AdditionalDataService;
  let httpMock: HttpTestingController;
  let elemDefault: IAdditionalData;
  let expectedResult: IAdditionalData | IAdditionalData[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdditionalDataService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      fieldCode: 'AAAAAAA',
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

    it('should create a AdditionalData', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AdditionalData()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AdditionalData', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fieldCode: 'BBBBBB',
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

    it('should partial update a AdditionalData', () => {
      const patchObject = Object.assign(
        {
          value: 'BBBBBB',
        },
        new AdditionalData()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AdditionalData', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fieldCode: 'BBBBBB',
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

    it('should delete a AdditionalData', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAdditionalDataToCollectionIfMissing', () => {
      it('should add a AdditionalData to an empty array', () => {
        const additionalData: IAdditionalData = { id: 123 };
        expectedResult = service.addAdditionalDataToCollectionIfMissing([], additionalData);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(additionalData);
      });

      it('should not add a AdditionalData to an array that contains it', () => {
        const additionalData: IAdditionalData = { id: 123 };
        const additionalDataCollection: IAdditionalData[] = [
          {
            ...additionalData,
          },
          { id: 456 },
        ];
        expectedResult = service.addAdditionalDataToCollectionIfMissing(additionalDataCollection, additionalData);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AdditionalData to an array that doesn't contain it", () => {
        const additionalData: IAdditionalData = { id: 123 };
        const additionalDataCollection: IAdditionalData[] = [{ id: 456 }];
        expectedResult = service.addAdditionalDataToCollectionIfMissing(additionalDataCollection, additionalData);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(additionalData);
      });

      it('should add only unique AdditionalData to an array', () => {
        const additionalDataArray: IAdditionalData[] = [{ id: 123 }, { id: 456 }, { id: 97669 }];
        const additionalDataCollection: IAdditionalData[] = [{ id: 123 }];
        expectedResult = service.addAdditionalDataToCollectionIfMissing(additionalDataCollection, ...additionalDataArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const additionalData: IAdditionalData = { id: 123 };
        const additionalData2: IAdditionalData = { id: 456 };
        expectedResult = service.addAdditionalDataToCollectionIfMissing([], additionalData, additionalData2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(additionalData);
        expect(expectedResult).toContain(additionalData2);
      });

      it('should accept null and undefined values', () => {
        const additionalData: IAdditionalData = { id: 123 };
        expectedResult = service.addAdditionalDataToCollectionIfMissing([], null, additionalData, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(additionalData);
      });

      it('should return initial array if no AdditionalData is added', () => {
        const additionalDataCollection: IAdditionalData[] = [{ id: 123 }];
        expectedResult = service.addAdditionalDataToCollectionIfMissing(additionalDataCollection, undefined, null);
        expect(expectedResult).toEqual(additionalDataCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
