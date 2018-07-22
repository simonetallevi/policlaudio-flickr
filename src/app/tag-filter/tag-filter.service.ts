import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TagFilterService {

    filters = {};

    constructor(
        private http: HttpClient
    ){
    }

    getFilters (key){
        return this.http.get<Object> ('../assets/filter.tags.json')
                .subscrbe(result => {
                    console.log(result)
                    this.filters = result;
                    observer.next(this.filters[key]);
                    observer.complete();
                })
    }
}