import { Component } from '@angular/core';
import { SeparatorComponent } from "./subcomponents";

@Component({
    selector: 'app-problem-page',
    standalone: true,
    templateUrl: './problem-page.component.html',
    styleUrls: ['./problem-page.component.scss'],
    imports: [SeparatorComponent]
})
export class ProblemPageComponent {}