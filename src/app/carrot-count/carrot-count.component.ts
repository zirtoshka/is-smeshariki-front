import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-carrot-count',
  standalone: true,
  imports: [],
  templateUrl: './carrot-count.component.html',
  styleUrl: './carrot-count.component.css'
})
export class CarrotCountComponent implements OnInit {
  @Input() commentId: number | null = null;
  @Input() count: number = 0;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.count) {
      this.cd.detectChanges();
      console.log(this.count);
    } else {
      this.count = 0
      this.cd.detectChanges();

    }
  }


}
