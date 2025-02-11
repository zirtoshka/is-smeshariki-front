import {Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommentS} from '../model/comment';
import {CommentService} from '../services/comment.service';
import {map, Observable} from 'rxjs';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {NzListComponent, NzListItemComponent} from 'ng-zorro-antd/list';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCommentComponent, NzCommentContentDirective} from 'ng-zorro-antd/comment';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {carrotIcon, carrotTouchedIcon} from '../services/icon.service';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {CarrotService} from '../services/carrot.service';
import {DataFormaterService} from '../data-formater.service';
import {NzBadgeComponent} from 'ng-zorro-antd/badge';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-comment-card2',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzListItemComponent,
    NzListComponent,
    NzButtonComponent,
    NzCommentContentDirective,
    NzAvatarComponent,
    NzCommentComponent,
    NzCardComponent,
    AsyncPipe,
    CarrotCountComponent,
    NzIconDirective,
    NzCardMetaComponent,
    NgClass,
    NzBadgeComponent,
    FormsModule
  ],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './comment-card2.component.html',
  styleUrl: './comment-card2.component.css'
})
export class CommentCard2Component implements OnInit {
  @Input() comment!: CommentS;

  @Output() loadRepliesEvent = new EventEmitter<number>();

  showReplies = false;

  iconCarrot = carrotIcon;
  @Input() isLiked!: boolean; //todo
  protected carrotService = inject(CarrotService);

  @Output() replyAdded = new EventEmitter<CommentS>();
  showReplyInput = false;
  replyText = '';

  hasMore: boolean | undefined = true;


  toggleReply() {
    this.showReplyInput = !this.showReplyInput;
  }

  submitReply() {
    if (!this.replyText.trim()) return;

    const newReply: CommentS = new CommentS({
      text: this.replyText,
      // post: this.comment.post,
      parentComment: this.comment.id
    })

    this.replyAdded.emit(newReply);
    this.commentService.createComment(newReply);
    this.showReplyInput = false;
    this.replyText = '';
  }


  protected commentService = inject(CommentService);



  constructor(
    protected dateFormatterService: DataFormaterService
  ) {
  }

  ngOnInit() {
    this.commentService.commentTree$.pipe(
      map(tree => tree.has(this.comment.id)) //есть ли ответы
    ).subscribe(hasReplies => {
      if (hasReplies) {
        this.showReplies = true; // ответы уже загружены — сразу показать
      }
    });

    this.hasMore = this.commentService.hasMoreRepliesMap.get(this.comment.id) === undefined;
    this.isLiked = this.comment.isLiked;
    this.setCarrotIcon();
  }


  replies$: Observable<CommentS[]> = this.commentService.commentTree$.pipe(
    map(tree => tree.get(this.comment.id) || [])
  );

  loadReplies(): void {
    console.log("loadReplies for " + this.comment.id);
    this.showReplies = false
    this.commentService.loadMoreReplies(this.comment.id);
    // this.loadRepliesEvent.emit(this.comment.id);
  }

  setCarrotIcon() {
    this.iconCarrot = this.isLiked ? carrotTouchedIcon : carrotIcon;
  }

  toggleLike() {
    if (!this.isLiked) {
      this.carrotService.setCarrotOnComment(this.comment.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked = true
            this.comment.countCarrots++;
            this.setCarrotIcon()
          }
        });
    } else {
      this.carrotService.deleteCarrotOnComment(this.comment.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked = false
            this.comment.countCarrots--;
            this.setCarrotIcon()
          }
        });
    }
  }

  onScroll(): void {
    console.log("scroll");
    console.log(this.commentService.hasMoreRepliesMap.get(this.comment.id));

    this.commentService.loadMoreReplies(this.comment.id);
    this.hasMore = this.commentService.hasMoreRepliesMap.get(this.comment.id) === undefined;
  }

}
