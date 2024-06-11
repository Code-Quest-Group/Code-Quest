import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ProblemPageComponent } from './components/views/problem-page';
import { SeparatorComponent } from "./components/views/problem-page/subcomponents";

@NgModule({
  declarations: [
  ],
  imports: [
    ProblemPageComponent,
    BrowserModule,
    HttpClientModule,
    SeparatorComponent
  ],
  bootstrap: []
})
export class AppModule { }
