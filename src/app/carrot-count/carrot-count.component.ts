import {Component, Input, OnInit} from '@angular/core';
import {CarrotService} from '../services/carrot.service';

@Component({
  selector: 'app-carrot-count',
  standalone: true,
  imports: [],
  templateUrl: './carrot-count.component.html',
  styleUrl: './carrot-count.component.css'
})
export class CarrotCountComponent implements OnInit {
  @Input() postId: number | null =null;
  count: number = 0;

  constructor(private carrotService: CarrotService) {}

  ngOnInit() {
    this.count = this.carrotService.getCarrotCountPost(this.postId)
  }
}
