import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { Secret } from './config/secret';
import { MaterialModule } from './/material.module';
import { ImagesService } from './images/images.service';
import { ImagesComponent, SlideshowDialog} from './images/images.component';
import { TagFilterComponent } from './tag-filter/tag-filter.component';
import { TagFilterService } from './tag-filter/tag-filter.service';

@NgModule({
  declarations: [
    AppComponent,
    ImagesComponent,
    TagFilterComponent,
    SlideshowDialog
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    SlideshowDialog
  ],
  providers: [
    ImagesService,
    TagFilterService,
    Secret,
    BreakpointObserver,
    MediaMatcher,
    SlideshowDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
