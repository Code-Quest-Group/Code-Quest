import { Component } from '@angular/core';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.scss']
})
export class ProblemListComponent {
  title = 'Problem Page';
  description = 'This is the problem page component.';
}
