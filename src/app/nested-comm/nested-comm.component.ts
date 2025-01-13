import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {
  NzCommentActionComponent,
  NzCommentAvatarDirective,
  NzCommentComponent,
  NzCommentContentDirective
} from 'ng-zorro-antd/comment';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {IconDefinition} from '@ant-design/icons-angular';
import {Likeable} from '../base/likeable';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../services/post.service';
import {CommentService} from '../services/comment.service';


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
    NzCommentContentDirective,
    CarrotCountComponent,
    NzIconDirective
  ],
  templateUrl: './nested-comm.component.html',
  styleUrl: './nested-comm.component.css'
})
export class NestedCommComponent implements Likeable {
  isLiked: boolean = false;
  iconCarrot = carrotIcon;

  @Input() groupedComments: any[] = [];

  constructor(
    private iconService: IconService,
  ) {}

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.iconCarrot = this.isLiked ? carrotTouchedIcon : carrotIcon;

    const url = this.isLiked
      ? `/api/comment/like`
      : `/api/comment/unlike`;

    console.log("происходит морковканье comment с ид", url)
  }

  protected readonly icon = carrotIcon;
}
