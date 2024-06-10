import { Component } from '@angular/core';
import { VerticalSeperatorComponent } from './subcomponents';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  templateUrl: './problem-page.component.html',
  styleUrls: ['./problem-page.component.scss'],
  imports: [ VerticalSeperatorComponent ],
})
export class ProblemPageComponent {
  title = 'Problem Page';
  description = 'This is the problem page component.';
}
