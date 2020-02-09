import { Component, OnInit, OnDestroy, Inject, HostListener, EventEmitter,
  Output, ElementRef, AfterViewInit, ViewChild} from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ImagesService, FlickrPhotosSearchResponse } from './images.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TagFilterService } from '../tag-filter/tag-filter.service';
import { AppService } from '../app.service';

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
  hasMore = true;
  loading = false;
  searchEvent;
  isMobile= false;

  onLoaded = new EventEmitter();

  constructor(
    private app: AppService,
    private images: ImagesService,
    private tagFilter: TagFilterService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
    this.mediaObserve = breakpointObserver.observe([
      Breakpoints.XLarge,
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe((result : BreakpointState) => {
      if(breakpointObserver.isMatched(Breakpoints.XLarge)){
        this.colsNum = 5;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Large)){
        this.colsNum = 4;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
        this.colsNum = 3;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.Small)){
        this.colsNum = 2;
        this.rowHeightPx = 300;
      } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
        this.colsNum = 1;
        this.rowHeightPx = 300;
      }
    });
    this.searchEvent = this.tagFilter.onSearch.subscribe(tags =>{
      this.loadTiles(tags);
    });
    this.isMobile = deviceService.isMobile();
  }

  openSlideShow(index) {
    // console.log(this.tiles[index])
    let dialog = this.dialog.open(SlideshowDialog, {
      disableClose:true,
      data: {
        'tiles': this.tiles,
        'index': index,
        'hasMore': true,
        'onLoaded': this.onLoaded
      }
    });
    const sub = dialog.componentInstance.onLoadMore.subscribe(() => {
      this.loadNextTiles()
        .then(() => {
          dialog.componentInstance.data.tiles = this.tiles;
          dialog.componentInstance.data.hasMore = this.hasMore;
          this.onLoaded.emit();
        })
        .catch();
    });
    dialog.afterClosed().subscribe(() => {
      console.log("load more unsubscribe");
      dialog.componentInstance.onLoadMore.unsubscribe();
    });
  }

  loadNextTiles(): Promise<any>{
    if(!this.hasMore || this.loading){
      return;
    }
    this.loading = true;
    this.app.spinner(true);
    return new Promise((resolve,reject) =>{
      this.images.next({'tags': this.tags})
        .subscribe(res =>{
          // console.log(res)
          if(!res || res.photos.page == res.photos.pages){
            this.hasMore = false;
          }
          this.tiles = this.tiles.concat(this.toTiles(res));
          resolve();
          this.app.spinner(false);
          this.loading = false;
        }, error => {
          this.loading = false;
          console.error(error);
          reject();
          this.app.spinner(false);
        });
    });
  }

  loadTiles(events){
    window.scroll(0,0);
    this.hasMore = true;
    this.tags = events.tags;
    this.app.spinner(true);
    this.images.reset()
    this.images.search({'tags': this.tags})
      .subscribe(res =>{
        console.log(res);
        debugger
        if(!res || res.photos.page == res.photos.pages){
          console.log("no more photo");
          this.hasMore = false;
        }
        this.tiles = this.toTiles(res);
        this.app.spinner(false);
      }, error => {
        console.error(error);
        this.app.spinner(false);
      });
  }

  toTiles(res : FlickrPhotosSearchResponse){
    var results = [];
    if(res != null){
      res.photos.photo.forEach(p =>{
        if(!p.url_s && !p.url_m){
          return;
        }
        if(!p.url_l){
          p.url_l = p.url_c;
        }
        //WF=WI*HF/HI

        results.push({
          nameVisibility: this.isMobile ? 'visible' : 'hidden',
          cols: 1,
          rows: 1,
          lastupdate: p.lastupdate,
          views: p.views,
          title: p.title,
          tags: (p.tags ? p.tags.split(" ").filter(t =>{return !t.startsWith("autouploadfilename")}) : []),
          url_l: p.url_l,
          url_m: p.url_m,
          url_s: p.url_s,
          styles: {
            'background-image': 'url(' + p.url_m +')',
            'background-size' : 'cover',
            'background-position': 'center',
            'border-radius': '0px 0px 0px 0px',
            '-moz-border-radius': '0px 0px 0px 0px',
            '-webkit-border-radius': '0px 0px 0px 0px'
          }
        });
      });
    }
    // console.log(results);
    return results;
  }

  onMouseOver(i, tile): void{
    if(!this.isMobile){
      tile.nameVisibility = 'visible';
    }
  }

  onMouseOut(i, tile): void{
    if(!this.isMobile){
      tile.nameVisibility = 'hidden';
    }
  }

  onScrollDown(): void {
    this.direction = 'down'
    this.loadNextTiles()
  }

  onUp(): void {
    this.direction = 'up'
  }

  ngOnInit(): void {
    console.log("images ngOnInit");
  }

  ngOnDestroy(): void {
    console.log("images ngOnDestroy");
    this.searchEvent.unsubscribe();
    this.mediaObserve.unsubscribe();
  }

}

export interface DialogData {
  tiles,
  index,
  hasMore,
  onLoaded;
}

@Component({
  selector: 'slideshow-dialog',
  templateUrl: 'slideshow.dialog.html',
  styleUrls: ['./slideshow.dialog.css']
})
export class SlideshowDialog implements AfterViewInit, OnInit, OnDestroy{
  margin = 80;
  currentImgWith = 0;
  maxWidth;
  maxHeight;
  currentTile;
  mediaObserve = null;
  currentIndex = 0;
  commandVisibility = 'hidden';
  largeCommandButtons = false;
  smallScreen = false;

  onLoadMore = new EventEmitter();

  @ViewChild('dialogimage')image;

  constructor(
    public dialogRef: MatDialogRef<SlideshowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private el:ElementRef,
    private breakpointObserver: BreakpointObserver) {
      this.mediaObserve = breakpointObserver.observe([
        Breakpoints.XLarge,
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall
      ]).subscribe((result : BreakpointState) => {
        if(breakpointObserver.isMatched(Breakpoints.XLarge)){
          this.largeCommandButtons = true;
          this.smallScreen = false;
          this.margin = 300
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.Large)){
          this.largeCommandButtons = true;
          this.smallScreen = false;
          this.margin = 200
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
          this.largeCommandButtons = true;
          this.smallScreen = false;
          this.margin = 150
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.Small)){
          this.largeCommandButtons = false;
          this.smallScreen = true;
          this.margin = 90
          this._resize()
        } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
          this.largeCommandButtons = false;
          this.smallScreen = true;
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
      this.currentImgWith = 0;
      this.currentIndex += 1;
      this.data.index = this.currentIndex;
      this.currentTile = this.data.tiles[this.currentIndex];
    }else{
      this._onLoadMoreImages();
    }
  }

  previous(){
    this.currentImgWith = 0;
    if((this.currentIndex - 1) >= 0){
      this.currentIndex -= 1;
      this.data.index = this.currentIndex;
      this.currentTile = this.data.tiles[this.currentIndex];
    }
  }

  onImageLoaded(){
    this.currentImgWith = this.image.nativeElement.clientWidth;
    setTimeout(()=>{
      this.commandVisibility = 'visible';
    }, 600);
}

  close(){
    this.dialogRef.close()
  }

  ngOnInit() {
    this.currentImgWith = 0;
    this.commandVisibility = 'hidden';
    this.currentIndex = this.data.index;
    this.currentTile = this.data.tiles[this.currentIndex];
    this.data.onLoaded.subscribe(() => {
      if(this.data.hasMore){
        this.currentImgWith = 0;
        this.next();
      }
    });
  }

  ngOnDestroy(){
    this.mediaObserve.unsubscribe();
  }

  ngAfterViewInit(){
  }

  private _onLoadMoreImages() {
    this.onLoadMore.emit();
  }

  private _resize(){
    this.maxWidth = window.innerWidth - this.margin;
    this.maxHeight = window.innerHeight - 80;
  }
}
