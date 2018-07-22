import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { Secret } from './config/secret';
import { MaterialModule } from './/material.module';
import { ImagesService } from './images/images.service';
import { ImagesComponent } from './images/images.component';
import { TagFilterComponent } from './tag-filter/tag-filter.component';
import { TagFilterService } from './tag-filter/tag-filter.service';

@NgModule({
  declarations: [
    AppComponent,
    ImagesComponent,
    TagFilterComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  providers: [
    ImagesService,
    TagFilterService,
    Secret,
    BreakpointObserver,
    MediaMatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
