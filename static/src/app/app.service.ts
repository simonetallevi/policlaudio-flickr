import { Injectable } from '@angular/core';
import { Subject } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  onSidenavToggle;
  onSpinnerToggle;

  constructor() {
    this.onSidenavToggle = new Subject<Boolean>(),
    this.onSpinnerToggle = new Subject<Boolean>()
  }

  toggleSidenav(): void{
    this.onSidenavToggle.next();
  }

  spinner(start): void{
    this.onSpinnerToggle.next(start);
  }
}