import {Component, Input, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-nested-comm',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './nested-comm.component.html',
  styleUrl: './nested-comm.component.css'
})
export class NestedCommComponent {
  @Input() groupedComments: any[] = [];

}
