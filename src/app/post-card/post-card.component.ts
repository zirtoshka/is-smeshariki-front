import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AsyncPipe, DatePipe, Location, NgForOf, NgIf} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Post} from '../model/post';
import {PostService} from '../services/post.service';
import {ActivatedRoute} from '@angular/router';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {CommentS} from '../model/comment';
import {CommentService} from '../services/comment.service';
import {Likeable} from '../base/likeable';
import {PostTagComponent} from '../post-tag/post-tag.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {BackButtonComponent} from '../back-button/back-button.component';
import {DataFormaterService} from '../data-formater.service';
import {NotificationCustomService} from '../notification-custom.service';
import {CarrotService} from '../services/carrot.service';
import {CommentCard2Component} from '../comment-card2/comment-card2.component';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../base/base.service';
import {AuthorService} from '../author.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AvatarComponent} from '../avatar/avatar.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {Smesharik} from '../auth-tools/smesharik';
import {NzImageDirective, NzImageService} from 'ng-zorro-antd/image';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {NzContextMenuService, NzDropDownDirective, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import {DopMenuComponent} from '../dop-menu/dop-menu.component';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzTagComponent,
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
    NzImageDirective,
    NzModalComponent,
    NzDropdownMenuComponent,
    NzMenuItemComponent,
    NzMenuDirective,
    NzSubMenuComponent,
    NzDropDownDirective,
    DopMenuComponent
  ],
  providers: [PostService, DatePipe, CommentService, NzModalService, NzContextMenuService],
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
  protected notificationCustomService = inject(NotificationCustomService);
  protected carrotService = inject(CarrotService);
  protected authorService = inject(AuthorService);


  @Input() post!: Post;
  postAuthor$!: Observable<Smesharik>;


  protected commentService = inject(CommentService);
  comments$ = this.commentService.comments$;
  hasMore$ = this.commentService.hasMore$;
  commentTree$ = this.commentService.commentTree$;

  imageUrl!:any;

  iconCarrot = carrotIcon;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
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
      this.postService.getPostById(id).subscribe({
        next: (response) => {
          this.post = Post.fromBackend(response);
          // this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
          this.isCommentExisted = this.commentsList.length > 0;

          this.commentService.loadComments(this.post.id);
          this.carrotService.isLikePost(this.post.id).subscribe({
            next: (result: boolean) => {
              this.isLiked$.next(result);
              this.setCarrotIcon();
            },
            error: (err) => {
              console.error('Ошибка при получении лайков:', err);
            }
          });
          this.postAuthor$ = this.authorService.getSmesharikByLogin(this.post.author);

          this.loadImage();
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });

    } else {
      this.commentService.loadComments(this.post.id);
      this.carrotService.isLikePost(this.post.id).subscribe({
        next: (result: boolean) => {
          this.isLiked$.next(result);
          this.setCarrotIcon();
        },
        error: (err) => {
          console.error('Ошибка при получении лайков:', err);
        }
      });
      if (!this.post.smesharikAuthor ) {
        this.postAuthor$ = this.authorService.getSmesharikByLogin(this.post.author);

      }

      this.loadImage();

    }


  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      // this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
      this.isCommentExisted = this.commentsList.length > 0;
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
      // this.commentService.resetComments(); // Очищаем список перед загрузкой
      // this.commentService.loadMoreComments(this.post.id);
    }
    // this.isCommentsVisible = !this.isCommentsVisible;
  }

  onScroll(): void {
    this.commentService.loadMore();
  }

  onLoadReplies(parentId: number): void {
    this.commentService.loadReplies(parentId);
  }


  loadImage(): void {
    if (!this.post.pathToImage) return
    this.postService.downloadImage(this.post.pathToImage).subscribe((imageBlob: Blob) => {
        // Создаем URL для blob
      this.imageUrl = URL.createObjectURL(imageBlob);
    });
  }

  createComment(){
    if (!this.replyText.trim()) return;

    const newReply: CommentS = new CommentS({
      text: this.replyText,
      post: this.post.id,
    })

    this.commentService.createComment(newReply  );

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
}
