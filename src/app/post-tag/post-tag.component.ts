import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {NzTagComponent} from "ng-zorro-antd/tag";

@Component({
  selector: 'app-post-tag',
  standalone: true,
  imports: [
    NgIf,
    NzTagComponent
  ],
  templateUrl: './post-tag.component.html',
  styleUrl: './post-tag.component.css'
})
export class PostTagComponent {
  @Input() isDraft!: boolean;
  @Input() isPrivate!: boolean;

}
