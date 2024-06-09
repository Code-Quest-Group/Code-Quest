import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vertical-seperator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertical-seperator.component.html',
  styleUrls: ['./vertical-seperator.component.scss']
})
export class VerticalSeperatorComponent {
  @Input() marginLeftRight: string = '0.6rem';
}
