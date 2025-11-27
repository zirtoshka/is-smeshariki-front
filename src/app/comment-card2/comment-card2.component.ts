import {Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommentS} from '../model/comment';
import {CommentFacade} from '../facade/comment.facade';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {AsyncPipe, DatePipe, Location, NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {CarrotFacade} from '../facade/carrot.facade';
import {DataFormaterService} from '../data-formater.service';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthorService} from '../author.service';
import {NotificationService} from '../services/notification.service';
import {BackButtonComponent} from '../back-button/back-button.component';
import {AvatarComponent} from '../avatar/avatar.component';
import {Smesharik} from '../auth-tools/smesharik';
import {DopMenuComponent} from "../dop-menu/dop-menu.component";
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-comment-card2',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzButtonComponent,
    NzCardComponent,
    AsyncPipe,
    CarrotCountComponent,
    NzIconDirective,
    NzCardMetaComponent,
    FormsModule,
    BackButtonComponent,
    AvatarComponent,
    DopMenuComponent
  ],
  providers: [DatePipe, NzModalService],
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

  protected carrotFacade = inject(CarrotFacade);

  @Output() replyAdded = new EventEmitter<CommentS>();
  showReplyInput = false;
  replyText = '';
  protected authorService = inject(AuthorService);
  protected notificationService = inject(NotificationService);

  hasMore: boolean | undefined = true;

  toggleReply() {
    this.showReplyInput = !this.showReplyInput;
  }

  submitReply() {
    if (!this.replyText.trim()) return;

    const newReply: CommentS = new CommentS({
      text: this.replyText,
      // post: this.comment.post,
      parentComment: this.comment.id,
      countCarrots:0
    })

    this.replyAdded.emit(newReply);
    this.commentFacade.createComment(newReply ,  this.comment.id );

    this.showReplyInput = false;
    this.replyText = '';
  }


  protected commentFacade = inject(CommentFacade);

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
      this.commentFacade.getCommentsById(id).subscribe({
        next: (response) => {

          this.comment = response;
          this.carrotFacade.isLikeComment(this.comment.id).subscribe({
            next: (result: boolean) => {
              this.isLiked$.next(result);
              this.setCarrotIcon();
            },
            error: () => {
              this.notificationService.showError('Ошибка при получении лайков');
            }
          });
          this.commentAuthor$ = this.authorService.getSmesharikByLogin(this.comment.smesharik);
        },
        error: (err: any) => {
          this.notificationService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });
    }else {
      this.commentFacade.commentTree$.pipe(
        map(tree => tree.has(this.comment.id)) //есть ли ответы
      ).subscribe(hasReplies => {
        if (hasReplies) {
          this.showReplies = true; // ответы уже загружены — сразу показать
        }
        this.hasMore = this.commentFacade.hasMoreRepliesMap.get(this.comment.id) === undefined;

      });

      this.hasMore = this.commentFacade.hasMoreRepliesMap.get(this.comment.id) === undefined;
      this.carrotFacade.isLikeComment(this.comment.id).subscribe({
        next: (result: boolean) => {
          this.isLiked$.next(result);
          this.setCarrotIcon();
        },
        error: () => {
          this.notificationService.showError('Ошибка при получении лайков');
        }
      });

    }
    this.commentAuthor$ = this.authorService.getSmesharikByLogin(this.comment.smesharik);
  }

  replies$: Observable<CommentS[]> = this.commentFacade.commentTree$.pipe(
    map(tree => tree.get(this.comment.id) || [])
  );

  loadReplies(): void {
    console.log("loadReplies for " + this.comment.id);
    this.showReplies = false
    this.commentFacade.loadMoreReplies(this.comment.id);
    // this.loadRepliesEvent.emit(this.comment.id);
  }

  setCarrotIcon() {
    this.iconCarrot = this.isLiked$.value ? carrotTouchedIcon : carrotIcon;
  }

  toggleLike() {
    if (!this.isLiked$.value) {
      this.carrotFacade.setCarrotOnComment(this.comment.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked$.next(true);
            if(this.comment.countCarrots){
              this.comment.countCarrots++;
            }else{
              this.comment.countCarrots=1
            }
            this.setCarrotIcon()
          }
        });
    } else {
      this.carrotFacade.deleteCarrotOnComment(this.comment.id)
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
    this.hasMore = this.commentFacade.hasMoreRepliesMap.get(this.comment.id) === undefined;
    this.commentFacade.loadMoreReplies(this.comment.id);
  }

  handleGoBack(): void {
    console.log('Go back clicked');
    this.location.back();
  }
}
