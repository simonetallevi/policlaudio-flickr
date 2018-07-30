import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener} from '@angular/core';
import {FormControl} from '@angular/forms';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { TagFilterService } from './tag-filter.service';

@Component({
  selector: 'tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit, OnDestroy {

    withAccordium = false;
    tagSlice = 3;
    tags = [];
    mediaObserve;
    selectedTags = [];

    @Output() selected: EventEmitter<object> = new EventEmitter();

    constructor(
        private breakpointObserver: BreakpointObserver,
        private tagFilterService: TagFilterService
    ){
        this.mediaObserve = breakpointObserver.observe([
            Breakpoints.XLarge,
            Breakpoints.Large,
            Breakpoints.Medium,
            Breakpoints.Small,
            Breakpoints.XSmall
          ]).subscribe((result : BreakpointState) => {
            if(breakpointObserver.isMatched(Breakpoints.XLarge)){
                this.withAccordium = false;
            } else if(breakpointObserver.isMatched(Breakpoints.Large)){
                this.withAccordium = false;
            } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
                this.withAccordium = false;
            } else if(breakpointObserver.isMatched(Breakpoints.Small)){
                this.withAccordium = true;
            } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
                this.withAccordium = true;
            }
          });
    }

    _loadFilters(tagName: String): void{
        if(!tagName){
            tagName = 'root';
        }
        this.tagFilterService.getFilters(tagName).subscribe(
            results =>{
                this.tags = [];
                for(var key  in results){
                    this.tags.push({name:key, type:results[key]});
                }
            }, 
            error =>{console.log('error'+ error)}, 
            () => {console.log('completed')});
    }

    @HostListener('select')
    selectTag(el, tag): void{
        this.selectedTags.push(tag);
        var key = this.selectedTags.map(x => { return x.name }).join('_');
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }
    deselectTag(el, tag): void{
        this.selectedTags = this.selectedTags.slice(0, this.selectedTags.length-1);
        var key = this.selectedTags.map(x => { return x.name }).join('_');
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }

    ngOnInit(): void {
        this._loadFilters('root');
    }
    
    ngOnDestroy(): void {
    }
}