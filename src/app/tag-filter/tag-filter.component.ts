import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener, ElementRef,Renderer2,ViewChild} from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatChipInputEvent} from '@angular/material';
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

    maxVisibleTags = 3;
    tags = [];
    mediaObserve;
    selectedOption = "";
    selectedTags = [];
    selectedVisibleTags = [];
    selectable = true;
    removable = true;
    addOnBlur = true;

    myControl = new FormControl();
    options: string[] = [];
    filteredOptions: Observable<string[]>;
    filterSelector;

    @ViewChild('filterSelector') el:ElementRef;
    @Output() selected: EventEmitter<object> = new EventEmitter();

    constructor(
        private breakpointObserver: BreakpointObserver,
        private tagFilterService: TagFilterService,
        private rd: Renderer2
    ){
        this.mediaObserve = breakpointObserver.observe([
            Breakpoints.XLarge,
            Breakpoints.Large,
            Breakpoints.Medium,
            Breakpoints.Small,
            Breakpoints.XSmall
          ]).subscribe((result : BreakpointState) => {
            if(breakpointObserver.isMatched(Breakpoints.XLarge)){
                this.maxVisibleTags = 10;
            } else if(breakpointObserver.isMatched(Breakpoints.Large)){
                this.maxVisibleTags = 8;
            } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
                this.maxVisibleTags = 5;
            } else if(breakpointObserver.isMatched(Breakpoints.Small)){
                this.maxVisibleTags = 3;
            } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
                this.maxVisibleTags = 1;
            }
            this._setSelectedVisibleTags();
          });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        if (input) {
            input.value = '';
        }
    }

    @HostListener('select')
    selectTag(el, tag): void{
        this.selectedTags.push(tag);
        this._setSelectedVisibleTags();
        var key = this.selectedTags.join('_');
        this.selectedOption = key.split("_").join(" ");
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }
    deselectTag(el, tag): void{
        this.selectedTags = this.selectedTags.slice(0, this.selectedTags.length-1);
        this._setSelectedVisibleTags();
        var key = this.selectedTags.join('_');
        this.selectedOption = key.split("_").join(" ");
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
    }

    ngAfterViewInit() {
        this.filterSelector = this.el.nativeElement;
        this.el.nativeElement.addEventListener('scroll', function(){
            console.log("scroll");
        });
    }

    ngOnInit(): void {
        this._loadKeys();
        this._loadFilters('root');
    }
    
    ngOnDestroy(): void {
    }

    @HostListener('select')
    onAutocompleSelected(option): void {
        console.log(this.myControl.value);
        this.selectedOption = this.myControl.value;
        this.selectedTags = this.selectedOption.split(" ");
        var key = this.selectedTags.join('_');
        this._loadFilters(key);
        this.selected.emit({ tags: this.selectedTags });
        this._setSelectedVisibleTags()
    }

    private _setSelectedVisibleTags(){
        if(this.maxVisibleTags >= this.selectedTags.length){
            this.selectedVisibleTags = this.selectedTags;
        }else{
            this.selectedVisibleTags = []
            this.selectedVisibleTags.push("..."+(this.selectedTags.length - this.maxVisibleTags));
            this.selectedVisibleTags = this.selectedVisibleTags.concat(this.selectedTags.slice(this.selectedTags.length - this.maxVisibleTags, this.selectedTags.length));
        }
    }

    private _loadFilters(tagName: String): void{
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

    private _loadKeys(): void{
        this.tagFilterService.getAllKeys().subscribe(
            results =>{
                this.options = results;
                this.filteredOptions = this.myControl.valueChanges
                    .pipe(startWith(''),map(value => this._filter(value))
        );
            }, 
            error =>{console.log('error'+ error)}, 
            () => {console.log('completed')});
    }


    private _filter(value: string): string[] {
        var filterValue = value.trim().toLowerCase();
        if(this.selectedTags.length > 0){
            var filterValue = (this.selectedTags.join(' ')+ ' ' + value).toLowerCase()
        }
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
}