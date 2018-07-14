import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

import { Secret } from '../config/secret';


export interface FlickrPhoto { 
  id: string,
  url_l: string,
  height_l: number,
  width_l: number
}

export interface FlickrPhotosSearch { 
  page: number,
  pages: number,
  perpage: number,
  total: string,
  photo: Array<FlickrPhoto>
}

export interface FlickrPhotosSearchResponse { 
  photos: FlickrPhotosSearch,
  stat: string
}

@Injectable()
export class ImagesService {
  
  input;
  page;
  pageSize;
    

  constructor(
    private http: HttpClient,
    private secret: Secret
  ) { 
    this.page = 0;
    this.pageSize = 10;
    this.input = {
      'method': 'flickr.photos.search',
      'user_id': this.secret.userId,
      'api_key': this.secret.apiKey,
      'format': 'json',
      'nojsoncallback': '1',
      'extras': 'url_l',
      'per_page': this.pageSize,
      'page': this.page
    };
  }

  _copy(inputParams, params){
    Object.keys(params).forEach(key => {
      console.log(key);
      inputParams[key] = params[key];
    });
    return inputParams;
  }

  reset(){
    this.page = 0;
  }

  next(params: object){
    this.page++;
    return this.search(params);
  }

  search(params: object){
    console.log(this.input);
    return this.http.get<FlickrPhotosSearchResponse>(
      'https://api.flickr.com/services/rest/',{
        params:this._copy(this.input, params)
    });
  }
}
