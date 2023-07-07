import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInterfaceParam } from '../interface-param.model';

@Component({
  selector: 'jhi-interface-param-detail',
  templateUrl: './interface-param-detail.component.html',
})
export class InterfaceParamDetailComponent implements OnInit {
  interfaceParam: IInterfaceParam | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interfaceParam }) => {
      this.interfaceParam = interfaceParam;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
