import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TagFilterService {

    filters = null;
    keys = null;

    constructor(
        private http: HttpClient
    ){
    }

    getFilters (key) : Observable<Object>{
        if(this.filters == null){
            return new Observable((observer) =>{
                this.http.get<Object> ('../assets/filter.tags.json')
                    .subscribe(result => {
                        this.filters = result;
                        observer.next(this.filters[key]);
                        observer.complete();
                    })
            });
        }
        return new Observable((observer) =>{
            observer.next(this.filters[key]);
            observer.complete();
        });
    }

    getAllKeys () : Observable<string[]>{
        if(this.keys == null){
            return new Observable((observer) =>{
                this.http.get<Object> ('../assets/filter.tags.json')
                    .subscribe(result => {
                        this.keys = []
                        for(var key  in result){
                            if(key == 'root')
                                continue;
                            this.keys.push(key.split("_").join(" "))
                        }
                        observer.next(this.keys);
                        observer.complete();
                    })
            });
        }
        return new Observable((observer) =>{
            observer.next(this.keys);
            observer.complete();
        });
    }
}