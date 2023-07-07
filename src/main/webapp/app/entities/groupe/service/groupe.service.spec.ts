import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGroupe, Groupe } from '../groupe.model';

import { GroupeService } from './groupe.service';

describe('Groupe Service', () => {
  let service: GroupeService;
  let httpMock: HttpTestingController;
  let elemDefault: IGroupe;
  let expectedResult: IGroupe | IGroupe[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GroupeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      descrtion: 'AAAAAAA',
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

    it('should create a Groupe', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Groupe()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Groupe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          descrtion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Groupe', () => {
      const patchObject = Object.assign({}, new Groupe());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Groupe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          descrtion: 'BBBBBB',
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

    it('should delete a Groupe', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGroupeToCollectionIfMissing', () => {
      it('should add a Groupe to an empty array', () => {
        const groupe: IGroupe = { id: 123 };
        expectedResult = service.addGroupeToCollectionIfMissing([], groupe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(groupe);
      });

      it('should not add a Groupe to an array that contains it', () => {
        const groupe: IGroupe = { id: 123 };
        const groupeCollection: IGroupe[] = [
          {
            ...groupe,
          },
          { id: 456 },
        ];
        expectedResult = service.addGroupeToCollectionIfMissing(groupeCollection, groupe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Groupe to an array that doesn't contain it", () => {
        const groupe: IGroupe = { id: 123 };
        const groupeCollection: IGroupe[] = [{ id: 456 }];
        expectedResult = service.addGroupeToCollectionIfMissing(groupeCollection, groupe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(groupe);
      });

      it('should add only unique Groupe to an array', () => {
        const groupeArray: IGroupe[] = [{ id: 123 }, { id: 456 }, { id: 46907 }];
        const groupeCollection: IGroupe[] = [{ id: 123 }];
        expectedResult = service.addGroupeToCollectionIfMissing(groupeCollection, ...groupeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const groupe: IGroupe = { id: 123 };
        const groupe2: IGroupe = { id: 456 };
        expectedResult = service.addGroupeToCollectionIfMissing([], groupe, groupe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(groupe);
        expect(expectedResult).toContain(groupe2);
      });

      it('should accept null and undefined values', () => {
        const groupe: IGroupe = { id: 123 };
        expectedResult = service.addGroupeToCollectionIfMissing([], null, groupe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(groupe);
      });

      it('should return initial array if no Groupe is added', () => {
        const groupeCollection: IGroupe[] = [{ id: 123 }];
        expectedResult = service.addGroupeToCollectionIfMissing(groupeCollection, undefined, null);
        expect(expectedResult).toEqual(groupeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
