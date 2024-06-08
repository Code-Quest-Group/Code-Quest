import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemPageComponent } from '../problem-page';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, ProblemPageComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  title = 'Welcome to the Main Page';
  description = 'This is a simple main page component in Angular.';
}
