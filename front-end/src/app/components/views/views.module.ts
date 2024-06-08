import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemPageComponent } from './problem-page';
import { MainPageComponent } from './main-page';

@NgModule({
  declarations: [
    ProblemPageComponent,
    MainPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProblemPageComponent,
    MainPageComponent
  ]
})
export class ViewsModule { }
