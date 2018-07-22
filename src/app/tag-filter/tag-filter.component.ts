import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { TagFilterService } from './tag-filter.service';

@Component({
  selector: 'tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit, OnDestroy {

    isMobile = false;
    tagSlice = 3;
    tags = ["some ramdon","test","cuusyasgsgasa","cuausyse ee","ciiiaausua","ciao",
    "47523","cdcis","csiaudca","cuusyasgsgasa","cuausyse ee","ciiiaausua","ciao","47523","cdcis","csiaudca"];

    constructor(
        private breakpointObserver: BreakpointObserver,
        private service: TagFilterService
    ){
        this.mediaObserve = breakpointObserver.observe([
            Breakpoints.XLarge,
            Breakpoints.Large,
            Breakpoints.Medium,
            Breakpoints.Small,
            Breakpoints.XSmall
          ]).subscribe((result : BreakpointState) => {
            if(breakpointObserver.isMatched(Breakpoints.XLarge)){
                this.isMobile = false;
            } else if(breakpointObserver.isMatched(Breakpoints.Large)){
                this.isMobile = false;
            } else if(breakpointObserver.isMatched(Breakpoints.Medium)){
                this.isMobile = false;
            } else if(breakpointObserver.isMatched(Breakpoints.Small)){
                this.isMobile = true;
            } else if(breakpointObserver.isMatched(Breakpoints.XSmall)){
                this.isMobile = true;
            }
          });
    }

    ngOnInit(): void {
        this.service.getFilters('root').subscribe(result1 =>{
            console.log(result1);
            this.service.getFilters('root').subscribe(result2 =>{
                console.log(result2);
            });
        });
    }
    
    ngOnDestroy(): void {
    }
}