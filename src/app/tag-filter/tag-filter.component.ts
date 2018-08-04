import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { TagFilterService } from './tag-filter.service';

@Component({
  selector: 'tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css'],
})
export class TagFilterComponent implements OnInit, OnDestroy {

    withAccordium = false;
    tagSlice = 3;
    tags = [];
    mediaObserve;
    selectedTags = [];
    reveseSelectedTags = [];
    selectable = true;
    removable = true;
    addOnBlur = false;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    myControl = new FormControl();
    options: string[] = [];
    filteredOptions: Observable<string[]>;

    @Output() selected: EventEmitter<object> = new EventEmitter();

    constructor(
        private breakpointObserver: BreakpointObserver,
        private tagFilterService: TagFilterService,
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
                    this.tags.push(key);
                }
            }, 
            error =>{console.log('error'+ error)}, 
            () => {console.log('completed')});
    }

    _loadKeys(): void{
        this.tagFilterService.getAllKeys().subscribe(
            results =>{
                this.options = results;
            }, 
            error =>{console.log('error'+ error)}, 
            () => {console.log('completed')});
    }

    @HostListener('select')
    selectTag(el, tag): void{
        this.selectedTags.push(tag);
        var key = this.selectedTags.join('_');
        this.myControl.setValue(key.split("_").join(" "))
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }
    deselectTag(el, tag): void{
        this.selectedTags = this.selectedTags.slice(0, this.selectedTags.length-1);
        var key = this.selectedTags.join('_');
        this.myControl.setValue(key.split("_").join(" "))
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }

    ngOnInit(): void {
        this._loadKeys();
        this._loadFilters('root');
        this.filteredOptions = this.myControl.valueChanges
            .pipe(startWith(''),map(value => this._filter(value))
        );
    }
    
    ngOnDestroy(): void {
    }

    @HostListener('select')
    onAutocompleSelected(option): void {
        console.log(this.myControl.value);
        this.selectedTags = this.myControl.value.split(" ");
        var key = this.selectedTags.join('_');
        this.myControl.setValue(key.split("_").join(" "))
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase()
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
}