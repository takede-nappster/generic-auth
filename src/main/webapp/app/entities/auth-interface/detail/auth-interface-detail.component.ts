import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuthInterface } from '../auth-interface.model';

@Component({
  selector: 'jhi-auth-interface-detail',
  templateUrl: './auth-interface-detail.component.html',
})
export class AuthInterfaceDetailComponent implements OnInit {
  authInterface: IAuthInterface | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authInterface }) => {
      this.authInterface = authInterface;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
