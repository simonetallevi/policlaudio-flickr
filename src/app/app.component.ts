import { Component, OnInit } from '@angular/core';

import 'hammerjs';
import { ImagesService } from './images/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  tiles = [
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 2, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  constructor(private images: ImagesService){ }

  ngOnInit(): void {
    this.images.search()
      .subscribe(res =>{
        console.log(res);
      })
  }
}
