import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPage } from '../about/about.page';
import { ExplorePage } from '../explore/explore.page';
import { SchedulePage } from '../schedule/schedule.page';
import { SocialPage } from '../social/social.page';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'schedule',
        loadChildren: () =>
          import('../schedule/schedule.module').then(
            (m) => m.SchedulePageModule
          ),
      },
      {
        path: 'explore',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../explore/explore.module').then(
                (m) => m.ExplorePageModule
              ),
          },
        ],
      },
      {
        path: 'social',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../social/social.module').then((m) => m.SocialPageModule),
          },
        ],
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../about/about.module').then((m) => m.AboutPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
