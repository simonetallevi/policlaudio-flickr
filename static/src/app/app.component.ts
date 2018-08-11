import 'hammerjs';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'app';
  visibleLogo= false;

  constructor(
    private spinner: NgxSpinnerService,
    private breakpointObserver: BreakpointObserver,
  ){
    breakpointObserver.observe([
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
  }

  showSpinner(){
    this.spinner.show();
  }

  hideSpinner(){
    this.spinner.hide()
  }

  ngOnInit(): void {
  }

}
