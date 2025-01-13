import {Component, Input, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {
  NzCommentActionComponent,
  NzCommentAvatarDirective,
  NzCommentComponent,
  NzCommentContentDirective
} from 'ng-zorro-antd/comment';

@Component({
  selector: 'app-nested-comm',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    NzAvatarComponent,
    NzCommentActionComponent,
    NzCommentAvatarDirective,
    NzCommentComponent,
    NzCommentContentDirective
  ],
  templateUrl: './nested-comm.component.html',
  styleUrl: './nested-comm.component.css'
})
export class NestedCommComponent {
  @Input() groupedComments: any[] = [];

}
