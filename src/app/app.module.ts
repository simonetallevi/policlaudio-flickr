import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { Secret } from './config/secret';
import { MaterialModule } from './/material.module';
import { ImagesService } from './images/images.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    ImagesService,
    Secret,
    BreakpointObserver,
    MediaMatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
