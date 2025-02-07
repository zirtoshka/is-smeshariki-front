import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-carrot-count',
  standalone: true,
  imports: [],
  templateUrl: './carrot-count.component.html',
  styleUrl: './carrot-count.component.css'
})
export class CarrotCountComponent {
  @Input() commentId: number | null = null; //todo delete
  @Input() count: number = 0;

}
