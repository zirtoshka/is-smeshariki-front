import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {CommentS} from '../model/comment';
import {CommentService} from '../services/comment.service';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {AsyncPipe, DatePipe, Location, NgClass, NgForOf, NgIf} from '@angular/common';
import {NzListComponent, NzListItemComponent} from 'ng-zorro-antd/list';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCommentComponent, NzCommentContentDirective} from 'ng-zorro-antd/comment';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {CarrotService} from '../services/carrot.service';
import {DataFormaterService} from '../data-formater.service';
import {NzBadgeComponent} from 'ng-zorro-antd/badge';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthorService} from '../author.service';
import {NotificationCustomService} from '../notification-custom.service';
import {BackButtonComponent} from '../back-button/back-button.component';
import {AvatarComponent} from '../avatar/avatar.component';
import {Smesharik} from '../auth-tools/smesharik';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {DopMenuComponent} from "../dop-menu/dop-menu.component";

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
        FormsModule,
        BackButtonComponent,
        AvatarComponent,
        NzTagComponent,
        DopMenuComponent
    ],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './comment-card2.component.html',
  styleUrl: './comment-card2.component.css'
})
export class CommentCard2Component implements OnInit {
  @Input() comment!: CommentS;
  commentAuthor$!: Observable<Smesharik>;


  @Output() loadRepliesEvent = new EventEmitter<number>();

  showReplies = false;
  @Input() isFeed = false


  iconCarrot = carrotIcon;
  // @Input() isLiked$!: Observable<boolean>; //todo

  @Input() isLiked$ = new BehaviorSubject<boolean>(false);

  protected carrotService = inject(CarrotService);

  @Output() replyAdded = new EventEmitter<CommentS>();
  showReplyInput = false;
  replyText = '';
  protected authorService = inject(AuthorService);
  protected notificationCustomService = inject(NotificationCustomService);


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
    this.commentService.createComment(newReply ,  this.comment.id );

    this.showReplyInput = false;
    this.replyText = '';
  }


  protected commentService = inject(CommentService);



  constructor(
    protected dateFormatterService: DataFormaterService,
    private route: ActivatedRoute,
    private location: Location,
    private iconService: IconService,
  ) {
  }


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(id)
    if(!this.comment || id!=0){
      // const id = Number(this.route.snapshot.paramMap.get('id'));
      this.commentService.getCommentsById(id).subscribe({
        next: (response) => {

          this.comment = CommentS.fromBackend(response);
          // this.carrotService.isLikeComment(this.comment.id).subscribe((result) => {
          //   this.isLiked = result;
          //   this.setCarrotIcon()
          // });

          this.carrotService.isLikeComment(this.comment.id).subscribe({
            next: (result: boolean) => {
              this.isLiked$.next(result);
              this.setCarrotIcon();
            },
            error: (err) => {
              console.error('Ошибка при получении лайков:', err);
            }
          });



          this.commentAuthor$ = this.authorService.getSmesharikByLogin(this.comment.smesharik);

          // this.authorService.getSmesharikByLogin(this.comment.smesharik).subscribe((result) => {
          //   console.log(result)
          //   this.comment.smesharikAuthor = result;
          // });
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });
    }else {
      this.commentService.commentTree$.pipe(
        map(tree => tree.has(this.comment.id)) //есть ли ответы
      ).subscribe(hasReplies => {
        if (hasReplies) {
          this.showReplies = true; // ответы уже загружены — сразу показать
        }
        this.hasMore = this.commentService.hasMoreRepliesMap.get(this.comment.id) === undefined;

      });

      this.hasMore = this.commentService.hasMoreRepliesMap.get(this.comment.id) === undefined;
      this.carrotService.isLikeComment(this.comment.id).subscribe({
        next: (result: boolean) => {
          this.isLiked$.next(result);
          this.setCarrotIcon();
        },
        error: (err) => {
          console.error('Ошибка при получении лайков:', err);
        }
      });

    }
    this.commentAuthor$ = this.authorService.getSmesharikByLogin(this.comment.smesharik);


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
    this.iconCarrot = this.isLiked$.value ? carrotTouchedIcon : carrotIcon;
  }


  toggleLike() {
    if (!this.isLiked$.value) {
      this.carrotService.setCarrotOnComment(this.comment.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked$.next(true);
            this.comment.countCarrots++;
            this.setCarrotIcon()
          }
        });
    } else {
      this.carrotService.deleteCarrotOnComment(this.comment.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked$.next(false);
            this.comment.countCarrots--;
            this.setCarrotIcon()
          }
        });
    }
  }

  onScroll(): void {
    this.hasMore = this.commentService.hasMoreRepliesMap.get(this.comment.id) === undefined;
    this.commentService.loadMoreReplies(this.comment.id);
  }

  handleGoBack(): void {
    console.log('Go back clicked');
    this.location.back();
  }
}
