import 'hammerjs';

import { BreakpointObserver, Breakpoints, 
          BreakpointState }             from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, ViewChild, Renderer2}             from '@angular/core';
import { AppService } from './app.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  
  title = 'app';
  visibleLogo= false;
  observer;
  onSpinnerEvent;
  onSidenavEvent;

  @ViewChild('sidenav')sidenav;

  constructor(
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private app: AppService 
  ){
    this.observer = breakpointObserver.observe([
      Breakpoints.XLarge,
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe((result : BreakpointState) => {
      if(breakpointObserver.isMatched(Breakpoints.XLarge)){
        this.visibleLogo = false;
      } else if(breakpointObserver.isMatched(Breakpoints.Large)){
        this.visibleLogo = false;
      } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
        this.visibleLogo = false;
      } else if(breakpointObserver.isMatched(Breakpoints.Small)){
        this.visibleLogo = true;
      } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
        this.visibleLogo = true;
      }
    });

    this.onSidenavEvent = app.onSidenavToggle.subscribe(toOpen => {
      console.log("sidenav");
      this.toggleSidenav();
    });

    this.onSpinnerEvent = app.onSpinnerToggle.subscribe(toStart => {
      console.log("spinner", toStart);
      if(toStart){
        this.spinner.show();
        this.renderer.addClass(document.body, 'disable-scroll');
      }else{
        this.spinner.hide()
        this.renderer.removeClass(document.body, 'disable-scroll');
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.observer.unsubscribe();
    this.onSidenavEvent.unsubscribe();
    this.onSpinnerEvent.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }
}

import { NgModule,ModuleWithProviders } from '@angular/core';
@NgModule({})
export class AppSharedModule {
    static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppSharedModule,
      providers: [ AppService ]
    }
  }
}

