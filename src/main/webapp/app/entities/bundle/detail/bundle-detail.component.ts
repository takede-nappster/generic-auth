import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBundle } from '../bundle.model';

@Component({
  selector: 'jhi-bundle-detail',
  templateUrl: './bundle-detail.component.html',
})
export class BundleDetailComponent implements OnInit {
  bundle: IBundle | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bundle }) => {
      this.bundle = bundle;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
