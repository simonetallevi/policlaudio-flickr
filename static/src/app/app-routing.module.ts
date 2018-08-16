import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImagesComponent }      from './images/images.component';

const appRoutes: Routes = [
  { path: '', component: ImagesComponent },
  { path: 'search/', redirectTo: ''},
  { path: 'search', redirectTo: ''},
  { path: 'search/:tags', component: ImagesComponent }
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