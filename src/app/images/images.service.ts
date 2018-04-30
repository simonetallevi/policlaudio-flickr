import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

import { Secret } from '../config/secret';


export interface FlickrPhotos { 
  id: string
}

export interface FlickrPhotosSearch { 
  page: number,
  pages: number,
  perpage: number,
  total: string,
  photo: Array<FlickrPhotos>
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

  search(){
    return this.http.get<FlickrPhotosSearchResponse>(
      'https://api.flickr.com/services/rest/',{
        params:{
          'method': 'flickr.photos.search',
          'user_id': this.secret.userId,
          'api_key': this.secret.apiKey,
          'format': 'json',
          'nojsoncallback': '1',
          'extras': 'url_l',
          'per_page': '10',
          'page': '1'
        }
    });
  }
}
