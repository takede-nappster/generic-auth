import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserInfo } from '../user-info.model';

@Component({
  selector: 'jhi-user-info-detail',
  templateUrl: './user-info-detail.component.html',
})
export class UserInfoDetailComponent implements OnInit {
  userInfo: IUserInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userInfo }) => {
      this.userInfo = userInfo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
