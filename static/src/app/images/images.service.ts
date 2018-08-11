import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 
import { HttpClient } from '@angular/common/http';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

import { Secret } from '../config/secret';


export class FlickrPhoto { 
  id: string;
  url_l: string;
  url_m: string;
  url_s: string;
  height_l: number;
  width_l: number;
  tags: string;
  title: string;
  views:number;
  lastupdate: number;

  constructor(url: string) {
    this.url_l = url;
    this.title = "image-title";
    this.views = 2;
    this.lastupdate = 2000000;
  }
}

export class FlickrPhotosSearch { 
  page: number;
  pages: number;
  perpage: number;
  total: string;
  photo: Array<FlickrPhoto>;
  
  constructor(photo: Array<FlickrPhoto>) {
    this.photo = photo;
  }
}

export class FlickrPhotosSearchResponse { 
  photos: FlickrPhotosSearch;
  stat: string;

  constructor(photos: FlickrPhotosSearch) {
    this.photos = photos;
  }
}

@Injectable()
export class ImagesService {
  
  input;
  currentPage;
    

  constructor(
    private http: HttpClient,
    private secret: Secret
  ) { 
    this.currentPage = 0;
    this.input = {
      'method': 'flickr.photos.search',
      'user_id': this.secret.userId,
      'api_key': this.secret.apiKey,
      'format': 'json',
      'nojsoncallback': '1',
      'extras': 'tags,url_t,url_m,url_s,url_l,views,last_update',
      'per_page': 25,
      'page': 0,
      'tag_mode': 'all',
      'tags':'',
      'in_gallery': false
    };
  }

  _copy(inputParams, params){
    Object.keys(params).forEach(key => {
      inputParams[key] = params[key];
    });
    return inputParams;
  }

  reset(){
    this.currentPage = 0;
  }

  next(params: object){
    this.currentPage = this.currentPage + 1;
    params['page'] = this.currentPage;
    return this.search(params);
  }

  search(params: object): Observable<FlickrPhotosSearchResponse>{
    if(params['tags']){
        params['tags'] = params['tags'].join(',');
    }else{
      delete(params['tags'])
    }
    params['page'] = this.currentPage
    console.log(params)
    var input = this._copy(this.input, params);
    // return new Observable((observer) =>{
    //         var res = new FlickrPhotosSearchResponse(
    //           new FlickrPhotosSearch(
    //             [new FlickrPhoto("../assets/img1.jpg"),new FlickrPhoto("../assets/img2.jpg"),
    //             new FlickrPhoto("../assets/img1.jpg"),new FlickrPhoto("../assets/img2.jpg"),
    //             new FlickrPhoto("../assets/img1.jpg"),new FlickrPhoto("../assets/img2.jpg")]
    //           )
    //         )
    //         observer.next(res);
    //         observer.complete();
    //     });
    return this.http.get<FlickrPhotosSearchResponse>(
      'https://api.flickr.com/services/rest/',{
        params:input
    });
  }
}
