import { Component, OnInit, OnDestroy, Inject, HostListener} from '@angular/core';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ImagesService, FlickrPhoto, FlickrPhotosSearchResponse } from './images.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  tags = [];
  visibleLogo = true;

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
        this.visibleLogo = true;
        this.colsNum = 5;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Large)){
        this.visibleLogo = true;
        this.colsNum = 4;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
        this.visibleLogo = true;
        this.colsNum = 3;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Small)){
        this.visibleLogo = false;
        this.colsNum = 2;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
        this.visibleLogo = false;
        this.colsNum = 2;
        this.rowHeightPx = 300;
      }
    });
  }

  openSlideShow(tile) {
    console.log(tile)
    this.dialog.open(SlideshowDialog, {
      data: {
        'url': tile.url
      }
    });
  }

  loadNextTiles(){
    var _self = this;

    this.images.next({'tags': this.tags})
      .subscribe(res =>{
        console.log(res)
        _self.tiles = _self.tiles.concat(_self.toTiles(res))
      }, error => {
        console.error(error);
      });
  }

  loadTiles($event){
    var _self = this;
    this.tags = $event.tags;
    this.images.reset()
    this.images.search({'tags': this.tags})
      .subscribe(res =>{
        console.log(res)
        _self.tiles = _self.toTiles(res)
      }, error => {
        console.error(error);
      });
  }

  toTiles(res : FlickrPhotosSearchResponse){
    var results = [];
    if(res != null){
      res.photos.photo.forEach(p =>{
        if(!p.url_l){
          return;
        }
        //WF=WI*HF/HI
        
        results.push({
          cols: 1,
          rows: 1,
          lastupdate: p.lastupdate,
          views: p.views,
          title: p.title,
          tags: (p.tags ? p.tags.split(" ") : []),
          url: p.url_l,
          styles: {
            'background-image': 'url(' + p.url_l +')',
            'background-size' : 'cover',
            'background-position': 'center',
            'border-radius': '10px 10px 10px 10px',
            '-moz-border-radius': '10px 10px 10px 10px',
            '-webkit-border-radius': '10px 10px 10px 10px'
          }
        });
      });
    }
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
    this.loadTiles([])
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
  styleUrls: ['./slideshow.dialog.css']
})
export class SlideshowDialog {
  margin = 20;
  maxWidth = window.innerWidth - this.margin;
  maxHeight = window.innerHeight - this.margin;

  constructor(
    public dialogRef: MatDialogRef<SlideshowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {    }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event);
    this.maxWidth = event.target.innerWidth - this.margin;
    this.maxHeight = event.target.innerHeigth - this.margin;
  }
  ngOnInit() {}
}
