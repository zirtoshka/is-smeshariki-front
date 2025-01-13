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
  @Input() commentId: number | null =null;
  count: number = 0;

  constructor(private carrotService: CarrotService) {}

  ngOnInit() {
    if(this.postId != null) {
      this.count = this.carrotService.getCarrotCountPost(this.postId)
    } else if (this.commentId != null) {
      this.count = this.carrotService.getCarrotCountComment(this.commentId)
    }

  }
}
