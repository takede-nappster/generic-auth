import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganisationService } from '../organisation-service.model';

@Component({
  selector: 'jhi-organisation-service-detail',
  templateUrl: './organisation-service-detail.component.html',
})
export class OrganisationServiceDetailComponent implements OnInit {
  organisationService: IOrganisationService | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organisationService }) => {
      this.organisationService = organisationService;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
