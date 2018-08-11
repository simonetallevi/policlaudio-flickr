import { Component, OnInit, OnDestroy, Inject, HostListener, EventEmitter, Output, ElementRef, AfterViewInit} from '@angular/core';

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

  @Output() onSpinnerShow: EventEmitter<void> = new EventEmitter<void>()
  @Output() onSpinnerHide: EventEmitter<void> = new EventEmitter<void>()

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
        this.colsNum = 1;
        this.rowHeightPx = 300;
      }
    });
  }

  openSlideShow(index) {
    console.log(this.tiles[index])
    let dialog = this.dialog.open(SlideshowDialog, {
      disableClose:true,
      data: {
        'tiles': this.tiles,
        'index': index
      }
    });
    const sub = dialog.componentInstance.onLoadMore.subscribe(() => {
      this.loadNextTiles()
        .then(() => {
          dialog.componentInstance.data.tiles = this.tiles;
        })
        .catch();
    });
    dialog.afterClosed().subscribe(() => {
      console.log("load more unsubscribe");
      dialog.componentInstance.onLoadMore.unsubscribe();
    });
  }

  loadNextTiles(): Promise<any>{
    this.onSpinnerShow.emit();
    return new Promise((resolve,reject) =>{
      this.images.next({'tags': this.tags})
        .subscribe(res =>{
          console.log(res)
          this.tiles = this.tiles.concat(this.toTiles(res));
          resolve();
          this.onSpinnerHide.emit();
        }, error => {
          console.error(error);
          reject();
          this.onSpinnerHide.emit();
        });
    });
  }

  loadTiles($event){
    this.tags = $event.tags;
    this.onSpinnerShow.emit();
    this.images.reset()
    this.images.search({'tags': this.tags})
      .subscribe(res =>{
        console.log(res);
        this.tiles = this.toTiles(res);
        this.onSpinnerHide.emit();
      }, error => {
        console.error(error);
        this.onSpinnerHide.emit();
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

  onScrollDown(): void {
    this.direction = 'down'
    this.loadNextTiles()
  }
  
  onUp(): void {
    console.log('scrolled up!');
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
  tiles,
  index;
}

@Component({
  selector: 'slideshow-dialog',
  templateUrl: 'slideshow.dialog.html',
  styleUrls: ['./slideshow.dialog.css']
})
export class SlideshowDialog implements AfterViewInit{
  margin = 80;
  maxWidth;
  maxHeight;
  currentTile;
  currentIndex;
  commandVisibility = 'hidden';
  largeCommandButtons = false;

  onLoadMore = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SlideshowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private el:ElementRef,
    private breakpointObserver: BreakpointObserver) {
      breakpointObserver.observe([
        Breakpoints.XLarge,
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall
      ]).subscribe((result : BreakpointState) => {
        if(breakpointObserver.isMatched(Breakpoints.XLarge)){
          this.largeCommandButtons = true;
          this.margin = 300
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.Large)){
          this.largeCommandButtons = true;
          this.margin = 200
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
          this.largeCommandButtons = true;
          this.margin = 150
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.Small)){
          this.largeCommandButtons = false;
          this.margin = 90
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
          this.largeCommandButtons = false;
          this.margin = 90
          this._resize()
        }
      });
    }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._resize()
  }
  
  next(){
    if((this.currentIndex + 1) < this.data.tiles.length){
      this.currentIndex += 1;
      this.currentTile = this.data.tiles[this.currentIndex];
    }else{
      this._onLoadMoreImages();
    }
  }

  previous(){
    if((this.currentIndex - 1) >= 0){
      this.currentIndex -= 1;
      this.currentTile = this.data.tiles[this.currentIndex];
    }
  }

  close(){
    this.dialogRef.close()
  }

  ngOnInit() {
    this.commandVisibility = 'hidden';
    this.currentIndex = this.data.index;
    this.currentTile = this.data.tiles[this.currentIndex];
    // console.log(this.currentIndex)
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.commandVisibility = 'visible';
    }, 600);
  }

  private _onLoadMoreImages() {
    this.onLoadMore.emit();
  }

  private _resize(){
    this.maxWidth = window.innerWidth - this.margin;
    this.maxHeight = window.innerHeight - 40;
  }
}