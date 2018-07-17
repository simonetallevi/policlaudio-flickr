import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ImagesService, FlickrPhoto, FlickrPhotosSearchResponse } from './images.service'
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit, OnDestroy {

  tiles = [];
  throttle = 300;
  colsNum = 3;
  rowHeightPx = 100;
  mediaObserve = null;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';

  constructor(
    private images: ImagesService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
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

  openSlideShow(tile :object) {
    console.log(tile)
    this.dialog.open(SlideshowDialog, {
      data: {
        url: ""
      }
    });
  }

  loadNextTiles(){
    var _self = this;

    this.images.next({})
      .subscribe(res =>{
        _self.tiles = _self.tiles.concat(_self.toTiles(res))
      }, error => {
        console.error(error);
      });
  }

  loadTiles(){
    var _self = this;
    
    this.images.search({})
      .subscribe(res =>{
        _self.tiles = _self.toTiles(res)
      }, error => {
        console.error(error);
      });
  }

  toTiles(res : FlickrPhotosSearchResponse){
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
    return results;
  }

  onScrollDown(ev): void {
    this.direction = 'down'
    this.loadNextTiles()
  }
  
  onUp(ev): void {
    console.log('scrolled up!', ev);
    this.direction = 'down'
  }

  ngOnInit(): void {
    this.loadTiles()
  }

  ngOnDestroy(): void {
    this.mediaObserve.unsubscribe();
  }

}

export interface DialogData {
  url;
}

@Component({
  selector: 'slideshow-dialog',
  templateUrl: 'slideshow.dialog.html',
})
export class SlideshowDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
