import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener, ElementRef,ViewChild} from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatChipInputEvent} from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, Router, NavigationEnd, Params} from '@angular/router';

import {map} from 'rxjs/operators';

import { TagFilterService, Tag } from './tag-filter.service';

@Component({
  selector: 'tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css'],
})
export class TagFilterComponent implements OnInit, OnDestroy {

    maxVisibleTags = 3;
    tags: Array<Tag> = [];
    routerEvent;
    mediaObserve;
    selectedOption: Array<Tag> = [];
    selectedTags: Array<Tag> = [];
    selectedVisibleTags: Array<Tag> = [];
    selectable = true;
    removable = true;
    addOnBlur = true;
    scrollInterval = null;
    scrollLeft = false;
    scrollRight = true;

    myControl = new FormControl();
    options: Array<Array<Tag>> = [];
    filteredOptions: Array<Array<Tag>> = [];
    filterSelector;
    innerWidth;
    maxScrollSize = 0;

    @ViewChild('filterSelector') el:ElementRef;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private tagFilterService: TagFilterService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){
        this.mediaObserve = this.breakpointObserver.observe([
            Breakpoints.XLarge,
            Breakpoints.Large,
            Breakpoints.Medium,
            Breakpoints.Small,
            Breakpoints.XSmall
          ]).subscribe((result : BreakpointState) => {
            if(this.breakpointObserver.isMatched(Breakpoints.XLarge)){
                this.maxVisibleTags = 10;
            } else if(this.breakpointObserver.isMatched(Breakpoints.Large)){
                this.maxVisibleTags = 8;
            } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)){
                this.maxVisibleTags = 5;
            } else if(this.breakpointObserver.isMatched(Breakpoints.Small)){
                this.maxVisibleTags = 3;
            } else if(this.breakpointObserver.isMatched(Breakpoints.XSmall)){
                this.maxVisibleTags = 1;
            }
            this._setSelectedVisibleTags();
        });

        this.routerEvent = this.router.events.subscribe((val) =>{
            if(val instanceof NavigationEnd && (val.url == "/" || val.url.startsWith("/search"))){
                console.log("routing");
                this._getSelectdTagFromUrl();
                this._selectTag(this.selectedTags, false);
                this.tagFilterService.search(this.selectedTags);
            }
        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        if (input) {
            input.value = '';
        }
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this._calcMaxScrollSize();
    }

    search(): void{
        this.tagFilterService.search(this.selectedTags);
    }

    selectTag(el, tag: Tag): void{
        this.selectedTags.push(tag);
        this._selectTag(this.selectedTags, false);
    }
    deselectTag(el, tag: Tag): void{
        this.selectedTags = this.selectedTags.slice(0, this.selectedTags.length-1);
        this._selectTag(this.selectedTags, true);
    }

    private _getSelectdTagFromUrl(){
        //TODO TO BE FIXED
        // this.activatedRoute.params.forEach(el => {
        //     if(el['tags']){
        //         var tags = atob(el['tags']).split("_");
        //         this.selectedTags = [];
        //         tags.forEach(function(t){
        //             this.selectedTags.push(Tag.fromString(t))
        //         });
        //     }
        // });
    }

    private _selectTag(selected: Array<Tag>, deselect: Boolean){
        if(selected){
            this._setSelectedVisibleTags();
            var key = selected.map(tag => tag.toString()).join('_');
            this.selectedOption = selected;
            this._loadFilters(key, deselect);
            this._routing(key);
        }else{
            this._loadFilters('root', deselect);
        }
    }

    private _routing(key){
        if(key){
            this.router.navigate(['/search/'+btoa(key)]);
        }else{
            this.router.navigate(['']);
        }
    }

    scroll(dir){
        // console.log(this.filterSelector)
        if(this.scrollInterval){
            clearInterval(this.scrollInterval);
        }
        const stepSize = [5,5,10,10,15,15,20,20,15,15,10,10,5,5];
        var scrollSize = stepSize.reduce((a, b) => a + b);
        var count = 0;
        this.scrollInterval = setInterval(()=> {
            var step = -stepSize[count];
            if(dir == 'left'){
                step = stepSize[count];
            }
            scrollSize -= stepSize[count];
            this.filterSelector.scrollLeft += step;
            this._scrollButtonsVisibilities();
            if(scrollSize <= 0){
                clearInterval(this.scrollInterval);
            }
            count++;
        },20); 
    }

    ngAfterViewInit() {
        this.filterSelector = this.el.nativeElement;
    }

    onScroll():void {
        this._scrollButtonsVisibilities();
    }

    ngOnInit(): void {
        this._loadKeys();
    }
    
    ngOnDestroy(): void {
        // this.mediaObserve.unsubscribe();
        // this.routerEvent.unsubscribe();
    }

    onAutocompleSelected(): void {
        if(this.myControl.value instanceof String 
            || this.myControl.value[0].type == 'NO-RESULTS'){
            return;
        }
        this.selectedOption = this.myControl.value;
        this.selectedTags = this.selectedOption;
        var key = this.selectedTags.map(tag => tag.toString()).join('_');
        this._loadFilters(key, false);
        this.tagFilterService.search(this.selectedTags);
        this._setSelectedVisibleTags()
    }

    private _setSelectedVisibleTags(){
        if(this.maxVisibleTags >= this.selectedTags.length){
            this.selectedVisibleTags = this.selectedTags;
        }else{
            this.selectedVisibleTags = []
            this.selectedVisibleTags.push(new Tag("cluster", "..."+(this.selectedTags.length - this.maxVisibleTags)));
            this.selectedVisibleTags = this.selectedVisibleTags.concat(this.selectedTags.slice(this.selectedTags.length - this.maxVisibleTags, this.selectedTags.length));
        }
    }

    private _scrollButtonsVisibilities(){
        if(this.maxScrollSize <= 0){
            this.scrollRight = false;
            this.scrollLeft = false;
        }else{
            if(this.filterSelector.scrollLeft == 0){
                this.scrollLeft = false;
            }else{
                this.scrollLeft = true;
            }
            if(this.filterSelector.scrollLeft >= this.maxScrollSize){
                this.scrollRight = false;
            }else{
                this.scrollRight = true;
            }
        }
    }

    private _calcMaxScrollSize(): void{
        this.maxScrollSize = this.filterSelector.scrollWidth - this.filterSelector.offsetWidth;
        console.log("max-scroll ", this.maxScrollSize);
        this._scrollButtonsVisibilities();
    }

    private _loadFilters(tagName: String, deselect: Boolean): void{
        var self = this;
        this.scrollRight = false;
        this.scrollLeft = false;
        if(!tagName){
            tagName = 'root';
        }
        this.tagFilterService.getFilters(tagName).subscribe(
            results =>{
                this.tags = results;
                if(this.tags && this.tags.length == 1){
                    if(!deselect){
                        this.selectTag(null, this.tags[0]);
                    }else{
                        this.deselectTag(null, this.tags[0]);
                    }

                }
                setTimeout(() => {
                    self._calcMaxScrollSize();
                }, 1000)
            }, 
            error =>{console.log('error'+ error)}, 
            () => {console.log('_loadFilters completed')});
    }

    private _loadKeys(): void{
        this.tagFilterService.getAllKeys().subscribe(
            results =>{
                this.options = results;
                this.myControl.valueChanges
                    .pipe(map(value => this._filter(value)))
                    .subscribe(
                        (res) =>{
                            this.filteredOptions = res;
                        }
                    );
            }, 
            error =>{console.log('error'+ error)}, 
            () => {console.log('_loadKeys completed')});
    }

    private _filter(value: any) : Array<Array<Tag>>{
        if(value instanceof Array){
            var array = value;
            value = array.map((v:Tag) => v.toString()).join(" ")
        }
        var trimmed = value.trim().toLowerCase();
        var filterValues = trimmed.split(' ');
        if(this.selectedTags.length > 0){
            filterValues = filterValues.concat(this.selectedTags.map(tag => tag.toString()));
        }
        var results = this.options.filter((option: Array<Tag>) => {
            var optionStr = option.map(tag => tag.toString()).join(' ').toLocaleLowerCase();
            if(trimmed.length > 0){
                for(var k in filterValues){
                    const v = filterValues[k];
                    if(optionStr.indexOf(v) == -1){
                        return false;
                    }
                }
            }
            return option;
        });
        if(results.length == 0){
            results.push([new Tag('NO-RESULTS', 'no results found!')]);
        }
        return results;
    }
}

import { NgModule,ModuleWithProviders } from '@angular/core';
@NgModule({})
export class TagFilterSharedModule {
    static forRoot(): ModuleWithProviders {
    return {
      ngModule: TagFilterSharedModule,
      providers: [ TagFilterService ]
    }
  }
}