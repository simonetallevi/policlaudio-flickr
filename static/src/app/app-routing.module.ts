import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImagesComponent }      from './images/images.component';
import { AboutComponent }      from './about/about.component';

const appRoutes: Routes = [
  { path: '', component: ImagesComponent },
  { path: 'about', component: AboutComponent},
  { path: 'search/:tags', component: ImagesComponent },
  { path: 'search/', redirectTo: ''},
  { path: 'search', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }