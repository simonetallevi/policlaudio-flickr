import { Injectable } from '@angular/core';
import { Subject } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  onSpinnerToggle;

  constructor() {
    this.onSpinnerToggle = new Subject<Boolean>()
  }
  
  spinner(start): void{
    this.onSpinnerToggle.next(start);
  }
}