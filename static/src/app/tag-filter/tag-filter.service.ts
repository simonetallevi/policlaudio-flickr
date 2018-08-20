import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TagFilterService {

    filters = null;
    keys = null;
    onSearch = new EventEmitter();
    headers;

    constructor(
        private http: HttpClient
    ){
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
        this.headers.append('Access-Control-Allow-Methods', 'GET,HEAD');
        this.headers.append('Access-Control-Allow-Origin', window.location.origin);
        console.log(this.headers);
    }

    search(tags: Array<String>){
        console.log("tag-filter search");
        this.onSearch.emit({tags: tags});
    }

    getFilters (key) : Observable<Object>{
        if(this.filters == null){
            return new Observable((observer) =>{
                this.http.get<Object> ('https://storage.googleapis.com/poli-claudio.appspot.com/filter.tags.json',{headers: this.headers})
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
                this.http.get<Object> ('https://storage.googleapis.com/poli-claudio.appspot.com/filter.tags.json', {headers: this.headers})
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
