import 'hammerjs';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'app';

  constructor(
    private spinner: NgxSpinnerService
  ){ }

  showSpinner(){
    this.spinner.show();
  }

  hideSpinner(){
    this.spinner.hide()
  }

  ngOnInit(): void {
  }

}
