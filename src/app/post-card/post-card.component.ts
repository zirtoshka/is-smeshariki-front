import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AsyncPipe, DatePipe, Location, NgForOf, NgIf} from '@angular/common';
import {Post} from '../model/post';
import {PostDataService} from '../data-access/post-data.service';
import {ActivatedRoute} from '@angular/router';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {CommentS} from '../model/comment';
import {CommentFacade} from '../facade/comment.facade';
import {PostTagComponent} from '../post-tag/post-tag.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {BackButtonComponent} from '../back-button/back-button.component';
import {DataFormaterService} from '../data-formater.service';
import {NotificationService} from '../services/notification.service';
import {CarrotService} from '../services/carrot.service';
import {CommentCard2Component} from '../comment-card2/comment-card2.component';
import {AuthorService} from '../author.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AvatarComponent} from '../avatar/avatar.component';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Smesharik} from '../auth-tools/smesharik';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {DopMenuComponent} from '../dop-menu/dop-menu.component';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzIconDirective,
    NgIf,
    CarrotCountComponent,
    NgForOf,
    PostTagComponent,
    NzButtonComponent,
    BackButtonComponent,
    NzCardMetaComponent,
    AsyncPipe,
    CommentCard2Component,
    ReactiveFormsModule,
    FormsModule,
    AvatarComponent,
    NzModalComponent,
    DopMenuComponent
  ],
  providers: [DatePipe, CommentFacade, NzModalService, NzContextMenuService],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent implements OnInit, OnChanges {
  commentsList: CommentS[] = [];
  isCommentsVisible: boolean = false;
  isCommentExisted: boolean = false;
  isLiked$ = new BehaviorSubject<boolean>(false);
  replyText = '';

  @Input() isFeed = false
  protected notificationService = inject(NotificationService);
  protected carrotService = inject(CarrotService);
  protected authorService = inject(AuthorService);

  @Input() post!: Post;
  postAuthor$!: Observable<Smesharik>;

  protected commentFacade = inject(CommentFacade);
  comments$ = this.commentFacade.comments$;
  hasMore$ = this.commentFacade.hasMore$;
  commentTree$ = this.commentFacade.commentTree$;

  imageUrl!:any;

  iconCarrot = carrotIcon;

  constructor(
    private route: ActivatedRoute,
    private postDataService: PostDataService,
    private location: Location,
    private iconService: IconService,
    protected dateFormatterService: DataFormaterService,
    private nzContextMenuService: NzContextMenuService
  ) {
  }

  handleGoBack(): void {
    this.location.back();
  }


  ngOnInit(): void {
    if (!this.post) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.postDataService.getPostById(id).subscribe({
        next: (response) => {
          this.post = response;
          // this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
          this.isCommentExisted = this.commentsList.length > 0;

          this.commentFacade.loadComments(this.post.id);
          this.carrotService.isLikePost(this.post.id).subscribe({
            next: (result: boolean) => {
              this.isLiked$.next(result);
              this.setCarrotIcon();
            },
            error: () => {
              this.notificationService.showError('Ошибка при получении лайков');
            }
          });
          this.setPostAuthorStream();

          this.loadImage();
        },
        error: (err: any) => {
          this.notificationService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });

    } else {
      this.commentFacade.loadComments(this.post.id);
      this.carrotService.isLikePost(this.post.id).subscribe({
        next: (result: boolean) => {
          this.isLiked$.next(result);
          this.setCarrotIcon();
        },
        error: () => {
          this.notificationService.showError('Ошибка при получении лайков');
        }
      });
      this.setPostAuthorStream();
      this.loadImage();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      // this.commentsList = this.commentFacade.getCommentsByPostId(this.post.id);
      this.isCommentExisted = this.commentsList.length > 0;
      this.setPostAuthorStream();
    }
  }

  toggleLike() {
    if (!this.isLiked$.value) {
      this.carrotService.setCarrotOnPost(this.post.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked$.next(true);
            this.post.countCarrots++;
            this.setCarrotIcon()
          }
        });
    } else {
      this.carrotService.deleteCarrotOnPost(this.post.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked$.next(false);
            this.post.countCarrots--;
            this.setCarrotIcon()
          }
        });
    }
  }

  setCarrotIcon() {
    this.iconCarrot = this.isLiked$.value ? carrotTouchedIcon : carrotIcon;
  }

  toggleComments() {
    this.isCommentsVisible = !this.isCommentsVisible;

    if (this.isCommentsVisible) {
      // this.commentFacade.resetComments(); // Очищаем список перед загрузкой
      // this.commentFacade.loadMoreComments(this.post.id);
    }
    // this.isCommentsVisible = !this.isCommentsVisible;
  }

  onScroll(): void {
    this.commentFacade.loadMore();
  }

  onLoadReplies(parentId: number): void {
    this.commentFacade.loadReplies(parentId);
  }

  loadImage(): void {
    if (!this.post.pathToImage) return
      this.postDataService.downloadImage(this.post.pathToImage).subscribe((imageBlob: Blob) => {
      this.imageUrl = URL.createObjectURL(imageBlob);
    });
  }

  createComment(){
    if (!this.replyText.trim()) return;

    const newReply: CommentS = new CommentS({
      text: this.replyText,
      post: this.post.id,
    })

    this.commentFacade.createComment(newReply  );

    this.replyText = '';
  }

  isModalVisible = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  private setPostAuthorStream(): void {
    if (!this.post) {
      return;
    }
    this.postAuthor$ = this.post.smesharikAuthor
      ? of(this.post.smesharikAuthor)
      : this.authorService.getSmesharikByLogin(this.post.author);
  }
}
