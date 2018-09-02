import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class Tag {
    type: string;
    value: string;

    constructor(type: string, value: string){
        this.type = type;
        this.value = value;
    }

    toString(){
        return this.type+"="+this.value;
    }

    static fromString(value: String): Tag{
        var ss = value.split("=");
        return new Tag(ss[0], ss[1]);
    }

    static fromArrayString(values: Array<String>): Array<Tag>{
        var res: Array<Tag> = [];
        values.forEach(function(value){
            var ss = value.split("=");
            res.push(new Tag(ss[0], ss[1]));
        })
        return res;
    }
}

@Injectable()
export class TagFilterService {

    filters: Map<string, Array<Tag>>;
    keys = null;
    onSearch = new EventEmitter();
    headers;
    baseUrl = "assets/";
    // baseUrl = "https://storage.googleapis.com/poli-claudio.appspot.com/";

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

    search(tags: Array<Tag>){
        console.log("tag-filter search");
        this.onSearch.emit({tags: tags});
    }

    getFilters (tagName) : Observable<Array<Tag>>{
        if(this.filters == null){
            return new Observable((observer) =>{
                this.http.get<Object> (this.baseUrl+'filter.tags.json', {headers: this.headers})
                    .subscribe(results => {
                        this.filters = new Map();
                        for(var key  in results){
                            if(!this.filters[key]){
                                this.filters[key] = [];
                            }
                            this.filters[key] = this.filters[key].concat(Tag.fromArrayString(results[key]));
                        }
                        observer.next(this.filters[tagName]);
                        observer.complete();
                    })
            });
        }
        return new Observable((observer) =>{
            observer.next(this.filters[tagName]);
            observer.complete();
        });
    }

    getAllKeys () : Observable<Array<Array<Tag>>>{
        if(this.keys == null){
            return new Observable((observer) =>{
                this.http.get<Object> (this.baseUrl+'filter.tags.json', {headers: this.headers})
                    .subscribe(result => {
                        this.keys = []
                        for(var key  in result){
                            if(key == 'root')
                                continue;
                            var kk = key.split("_");
                            this.keys.push([].concat(Tag.fromArrayString(kk)));
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
