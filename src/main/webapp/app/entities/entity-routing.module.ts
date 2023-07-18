import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-info',
        data: { pageTitle: 'UserInfos' },
        loadChildren: () => import('./user-info/user-info.module').then(m => m.UserInfoModule),
      },
      {
        path: 'role',
        data: { pageTitle: 'Roles' },
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      {
        path: 'authorization',
        data: {
          pageTitle: 'Authorizations',
          authorities: ['ROLE_ADMIN']
        },
        loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule),
      },
      {
        path: 'additional-data',
        data: { pageTitle: 'AdditionalData', authorities: ['ROLE_ADMIN'] },
        loadChildren: () => import('./additional-data/additional-data.module').then(m => m.AdditionalDataModule),
      },
      {
        path: 'session',
        data: { pageTitle: 'Sessions', authorities: ['ROLE_ADMIN'] },
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
      },
      {
        path: 'organisation-service',
        data: { pageTitle: 'OrganisationServices' },
        loadChildren: () => import('./organisation-service/organisation-service.module').then(m => m.OrganisationServiceModule),
      },
      {
        path: 'groupe',
        data: { pageTitle: 'Groupes' },
        loadChildren: () => import('./groupe/groupe.module').then(m => m.GroupeModule),
      },
      {
        path: 'organisation',
        data: { pageTitle: 'Organisations', authorities: ['ROLE_ADMIN'] },
        loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule),
      },
      {
        path: 'bundle',
        data: { pageTitle: 'Bundles' },
        loadChildren: () => import('./bundle/bundle.module').then(m => m.BundleModule),
      },
      {
        path: 'user-data',
        data: { pageTitle: 'UserData' },
        loadChildren: () => import('./user-data/user-data.module').then(m => m.UserDataModule),
      },
      {
        path: 'auth-interface',
        data: { pageTitle: 'AuthInterfaces',
        authorities: ['ROLE_ADMIN'] },
        loadChildren: () => import('./auth-interface/auth-interface.module').then(m => m.AuthInterfaceModule),
      },
      {
        path: 'interface-param',
        data: { pageTitle: 'InterfaceParams',
        authorities: ['ROLE_ADMIN'] },
        loadChildren: () => import('./interface-param/interface-param.module').then(m => m.InterfaceParamModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
