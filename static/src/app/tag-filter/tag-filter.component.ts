import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener, ElementRef,ViewChild} from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatChipInputEvent} from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';

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
    routerEvent;
    mediaObserve;
    selectedOption = "";
    selectedTags = [];
    selectedVisibleTags = [];
    selectable = true;
    removable = true;
    addOnBlur = true;
    scrollInterval = null;
    scrollLeft = false;
    scrollRight = true;

    myControl = new FormControl();
    options: string[] = [];
    filteredOptions: Observable<string[]>;
    filterSelector;
    innerWidth;
    maxScrollSize = 0;

    @ViewChild('filterSelector') el:ElementRef;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private tagFilterService: TagFilterService,
        private route: ActivatedRoute,
        private router: Router
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

        this.routerEvent = router.events.subscribe((val) =>{
            if(val instanceof NavigationEnd){
                this._getSelectdTagFromUrl();
                this._selectTag(this.selectedTags);
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

    selectTag(el, tag): void{
        this.selectedTags.push(tag);
        this._selectTag(this.selectedTags);
    }
    deselectTag(el, tag): void{
        this.selectedTags = this.selectedTags.slice(0, this.selectedTags.length-1);
        this._selectTag(this.selectedTags);
    }

    private _getSelectdTagFromUrl(){
        this.route.params.forEach(el => {
            if(el['tags']){
                this.selectedTags = atob(el['tags']).split("_");
            }
        });
    }

    private _selectTag(selected){
        if(selected){
            this._setSelectedVisibleTags();
            var key = selected.join('_');
            this.selectedOption = key.split("_").join(" ");
            this._loadFilters(key);
            this._routing(key);
        }else{
            this._loadFilters('root');
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
        this.mediaObserve.unsubscribe();
        this.routerEvent.unsubscribe();
    }

    onAutocompleSelected(): void {
        console.log(this.myControl.value);
        this.selectedOption = this.myControl.value;
        this.selectedTags = this.selectedOption.split(" ");
        var key = this.selectedTags.join('_');
        this._loadFilters(key);
        this.tagFilterService.search(this.selectedTags);
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

    private _loadFilters(tagName: String): void{
        var self = this;
        this.scrollRight = false;
        this.scrollLeft = false;
        if(!tagName){
            tagName = 'root';
        }
        this.tagFilterService.getFilters(tagName).subscribe(
            results =>{
                this.tags = [];
                for(var key  in results){
                    this.tags.push(key);
                }
                setTimeout(() => {
                    self._calcMaxScrollSize();
                }, 500)
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