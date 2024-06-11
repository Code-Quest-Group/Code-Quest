import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './separator.component.html',
  styleUrls: ['./separator.component.scss']
})
export class SeparatorComponent {
  @Input() marginLeftRight: string = '0.6rem';
  @Input() isVertical: boolean = true;
}
