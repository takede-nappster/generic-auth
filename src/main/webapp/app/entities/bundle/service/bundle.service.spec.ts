import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBundle, Bundle } from '../bundle.model';

import { BundleService } from './bundle.service';

describe('Bundle Service', () => {
  let service: BundleService;
  let httpMock: HttpTestingController;
  let elemDefault: IBundle;
  let expectedResult: IBundle | IBundle[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BundleService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      startDate: currentDate,
      endDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Bundle', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Bundle()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bundle', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bundle', () => {
      const patchObject = Object.assign(
        {
          endDate: currentDate.format(DATE_FORMAT),
        },
        new Bundle()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bundle', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Bundle', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBundleToCollectionIfMissing', () => {
      it('should add a Bundle to an empty array', () => {
        const bundle: IBundle = { id: 123 };
        expectedResult = service.addBundleToCollectionIfMissing([], bundle);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bundle);
      });

      it('should not add a Bundle to an array that contains it', () => {
        const bundle: IBundle = { id: 123 };
        const bundleCollection: IBundle[] = [
          {
            ...bundle,
          },
          { id: 456 },
        ];
        expectedResult = service.addBundleToCollectionIfMissing(bundleCollection, bundle);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bundle to an array that doesn't contain it", () => {
        const bundle: IBundle = { id: 123 };
        const bundleCollection: IBundle[] = [{ id: 456 }];
        expectedResult = service.addBundleToCollectionIfMissing(bundleCollection, bundle);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bundle);
      });

      it('should add only unique Bundle to an array', () => {
        const bundleArray: IBundle[] = [{ id: 123 }, { id: 456 }, { id: 72976 }];
        const bundleCollection: IBundle[] = [{ id: 123 }];
        expectedResult = service.addBundleToCollectionIfMissing(bundleCollection, ...bundleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bundle: IBundle = { id: 123 };
        const bundle2: IBundle = { id: 456 };
        expectedResult = service.addBundleToCollectionIfMissing([], bundle, bundle2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bundle);
        expect(expectedResult).toContain(bundle2);
      });

      it('should accept null and undefined values', () => {
        const bundle: IBundle = { id: 123 };
        expectedResult = service.addBundleToCollectionIfMissing([], null, bundle, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bundle);
      });

      it('should return initial array if no Bundle is added', () => {
        const bundleCollection: IBundle[] = [{ id: 123 }];
        expectedResult = service.addBundleToCollectionIfMissing(bundleCollection, undefined, null);
        expect(expectedResult).toEqual(bundleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
