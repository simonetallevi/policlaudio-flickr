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

  constructor(
    private http: HttpClient,
    private secret: Secret
  ) { }

  _copy(inputParams, params){
    Object.keys(params).forEach(key => {
      console.log(key);
      inputParams[key] = params[key];
    });
    return inputParams;
  }

  search(params: object){
    var inputParams = {
      'method': 'flickr.photos.search',
      'user_id': this.secret.userId,
      'api_key': this.secret.apiKey,
      'format': 'json',
      'nojsoncallback': '1',
      'extras': 'url_l',
      'per_page': '30',
      'page': '0'
    };

    return this.http.get<FlickrPhotosSearchResponse>(
      'https://api.flickr.com/services/rest/',{
        params:this._copy(inputParams, params)
    });
  }
}
