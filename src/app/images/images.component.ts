import { Component, OnInit, OnDestroy } from '@angular/core';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ImagesService, FlickrPhoto } from './images.service'
import { ImagesComponent } from './images.component';;

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit, OnDestroy {

  tiles = [];
  colsNum = 3;
  rowHeightPx = 100;
  mediaObserve = null;

  constructor(
    private images: ImagesService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.mediaObserve = breakpointObserver.observe([
      Breakpoints.XLarge,
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe((result : BreakpointState) => {
      if(breakpointObserver.isMatched(Breakpoints.XLarge)){
        this.colsNum = 8;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Large)){
        this.colsNum = 6;
        this.rowHeightPx = 200;
      } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
        this.colsNum = 4;
        this.rowHeightPx = 200;
      } else if(breakpointObserver.isMatched(Breakpoints.Small)){
        this.colsNum = 3;
        this.rowHeightPx = 200;
      } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
        this.colsNum = 3;
        this.rowHeightPx = 100;
      }
    });
  }

  _loadTiles(){

    var _self = this;

    this.images.search({})
      .subscribe(res =>{
        var results = [];
        res.photos.photo.forEach(p =>{
          if(!p.url_l){
            return;
          }
          //WF=WI*HF/HI
         
          results.push({
            cols: 1,
            rows: 1,
            styles: {
              'background-image': 'url(' + p.url_l +')',
              'background-size' : 'cover',
              'background-color': 'red',
              'background-position': 'center'
            }
          });
        });
        console.log(results);
        _self.tiles = results;
      }, error => {
        console.error(error);
        var results = [];
        for(var i=0; i<10; i++){
          results.push({
            cols: 1,
            rows: 1,
            styles: {
              'background-size' : 'cover',
              'background-color': 'red',
              'background-position': 'center'
            }
          });
        }
        _self.tiles = results;
      });
  }

  ngOnInit(): void {
    this._loadTiles()
  }

  ngOnDestroy(): void {
    this.mediaObserve.unsubscribe();
  }

}
