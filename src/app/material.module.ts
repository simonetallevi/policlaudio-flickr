import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, 
  MatCheckboxModule, 
  MatDialogModule, 
  MatExpansionModule, 
  MatFormFieldModule,
  MatChipsModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  imports: [
    BrowserAnimationsModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatToolbarModule,
    MatGridListModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatChipsModule
  ]
})
export class MaterialModule { }
