import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdditionalData } from '../additional-data.model';

@Component({
  selector: 'jhi-additional-data-detail',
  templateUrl: './additional-data-detail.component.html',
})
export class AdditionalDataDetailComponent implements OnInit {
  additionalData: IAdditionalData | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ additionalData }) => {
      this.additionalData = additionalData;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
