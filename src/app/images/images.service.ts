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
      'extras': 'url_l',
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

  search(params: object){
    if(params['tags']){
        params['tags'] = params['tags'].map(x => { return x.name }).join(',');
    }else{
      delete(params['tags'])
    }
    console.log(params)
    var input = this._copy(this.input, params);
    return this.http.get<FlickrPhotosSearchResponse>(
      'https://api.flickr.com/services/rest/',{
        params:input
    });
  }
}
