import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { UserType } from 'app/entities/enumerations/user-type.model';
import { IUserInfo, UserInfo } from '../user-info.model';

import { UserInfoService } from './user-info.service';

describe('UserInfo Service', () => {
  let service: UserInfoService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserInfo;
  let expectedResult: IUserInfo | IUserInfo[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserInfoService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      username: 'AAAAAAA',
      imagebiometric: 'AAAAAAA',
      dateOfBirth: currentDate,
      userType: UserType.ADMIN,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateOfBirth: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a UserInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateOfBirth: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.create(new UserInfo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          username: 'BBBBBB',
          imagebiometric: 'BBBBBB',
          dateOfBirth: currentDate.format(DATE_FORMAT),
          userType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserInfo', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
        },
        new UserInfo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          username: 'BBBBBB',
          imagebiometric: 'BBBBBB',
          dateOfBirth: currentDate.format(DATE_FORMAT),
          userType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a UserInfo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserInfoToCollectionIfMissing', () => {
      it('should add a UserInfo to an empty array', () => {
        const userInfo: IUserInfo = { id: 123 };
        expectedResult = service.addUserInfoToCollectionIfMissing([], userInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userInfo);
      });

      it('should not add a UserInfo to an array that contains it', () => {
        const userInfo: IUserInfo = { id: 123 };
        const userInfoCollection: IUserInfo[] = [
          {
            ...userInfo,
          },
          { id: 456 },
        ];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, userInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserInfo to an array that doesn't contain it", () => {
        const userInfo: IUserInfo = { id: 123 };
        const userInfoCollection: IUserInfo[] = [{ id: 456 }];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, userInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userInfo);
      });

      it('should add only unique UserInfo to an array', () => {
        const userInfoArray: IUserInfo[] = [{ id: 123 }, { id: 456 }, { id: 75114 }];
        const userInfoCollection: IUserInfo[] = [{ id: 123 }];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, ...userInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userInfo: IUserInfo = { id: 123 };
        const userInfo2: IUserInfo = { id: 456 };
        expectedResult = service.addUserInfoToCollectionIfMissing([], userInfo, userInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userInfo);
        expect(expectedResult).toContain(userInfo2);
      });

      it('should accept null and undefined values', () => {
        const userInfo: IUserInfo = { id: 123 };
        expectedResult = service.addUserInfoToCollectionIfMissing([], null, userInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userInfo);
      });

      it('should return initial array if no UserInfo is added', () => {
        const userInfoCollection: IUserInfo[] = [{ id: 123 }];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, undefined, null);
        expect(expectedResult).toEqual(userInfoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
