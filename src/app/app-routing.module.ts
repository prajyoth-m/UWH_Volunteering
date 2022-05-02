import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'explore',
    loadChildren: () => import('./pages/explore/explore.module').then( m => m.ExplorePageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'social',
    loadChildren: () => import('./pages/social/social.module').then( m => m.SocialPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'first-login',
    loadChildren: () => import('./pages/first-login/first-login.module').then( m => m.FirstLoginPageModule)
  },
  {
    path: 'contribute-modal',
    loadChildren: () => import('./pages/contribute-modal/contribute-modal.module').then( m => m.ContributeModalPageModule)
  },
  {
    path: 'manage-events',
    loadChildren: () => import('./pages/manage-events/manage-events.module').then( m => m.ManageEventsPageModule)
  },
  {
    path: 'add-event',
    loadChildren: () => import('./pages/add-event/add-event.module').then( m => m.AddEventPageModule)
  },
  {
    path: 'select-location',
    loadChildren: () => import('./pages/select-location/select-location.module').then( m => m.SelectLocationPageModule)
  },
  {
    path: 'add-session',
    loadChildren: () => import('./pages/add-session/add-session.module').then( m => m.AddSessionPageModule)
  },
  {
    path: 'manage-people',
    loadChildren: () => import('./pages/manage-people/manage-people.module').then( m => m.ManagePeoplePageModule)
  },
  {
    path: 'exit-event',
    loadChildren: () => import('./pages/exit-event/exit-event.module').then( m => m.ExitEventPageModule)
  },
  {
    path: 'create-user',
    loadChildren: () => import('./pages/create-user/create-user.module').then( m => m.CreateUserPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
