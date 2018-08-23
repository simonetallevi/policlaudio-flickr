import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppComponent, AppSharedModule } from './app.component';
import { Secret } from './config/secret';
import { MaterialModule } from './/material.module';
import { ImagesService } from './images/images.service';
import { ImagesComponent, SlideshowDialog} from './images/images.component';
import { TagFilterComponent, TagFilterSharedModule} from './tag-filter/tag-filter.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    ImagesComponent,
    TagFilterComponent,
    SlideshowDialog,
    AboutComponent
  ],
  imports: [
    AppSharedModule.forRoot(),
    TagFilterSharedModule.forRoot(),
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    DeviceDetectorModule.forRoot()
  ],
  entryComponents: [
    SlideshowDialog
  ],
  providers: [
    ImagesService,
    Secret,
    BreakpointObserver,
    MediaMatcher,
    SlideshowDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
