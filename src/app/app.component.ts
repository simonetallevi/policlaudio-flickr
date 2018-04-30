import { Component, OnInit, OnDestroy } from '@angular/core';

import 'hammerjs';
import { ImagesService, FlickrPhoto } from './images/images.service';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';

  tiles = [];

  constructor(
    private images: ImagesService
  ){ }

  _loadTiles(){

    var _self = this;

    this.images.search({})
      .subscribe(res =>{
        var results = [];
        res.photos.photo.forEach(p =>{
          if(!p.url_l){
            return;
          }
          
          var rate = (p.width_l/p.height_l)
          var cols = 2;
          var rows = 2;
          if(rate > (1 - 0.3) && rate < (1 + 0.3)){
            rows = 1;
          }else if(rate < (1 - 0.3) && rate > 0.3){
            cols = 1
          }
          console.log(rate);

          results.push({
            cols: cols,
            rows: rows,
            styles: {
              'background-image': 'url(' + p.url_l +')',
              'background-size' : 'cover',
              'background-position': 'center'
            }
          });
        });
        console.log(results);
        _self.tiles = results;
      });
  }

  ngOnInit(): void {
    this._loadTiles()
  }

  ngOnDestroy(): void {

  }
}
