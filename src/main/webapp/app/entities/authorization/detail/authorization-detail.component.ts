import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuthorization } from '../authorization.model';

@Component({
  selector: 'jhi-authorization-detail',
  templateUrl: './authorization-detail.component.html',
})
export class AuthorizationDetailComponent implements OnInit {
  authorization: IAuthorization | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authorization }) => {
      this.authorization = authorization;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
