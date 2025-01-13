import {Component, Input, OnInit} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Post} from '../post';
import {PostService} from '../diary/post.service';
import {ActivatedRoute} from '@angular/router';
import {carrotIcon, carrotTouchedIcon, IconService} from '../icon.service';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzTagComponent,
    CarrotCountComponent
  ],
  providers: [PostService],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  isLiked = false;

  @Input() post!: Post;

  icon = carrotIcon;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private iconService: IconService) {
  }

  ngOnInit(): void {
    if (!this.post) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.post = this.postService.getPostById(id)!;
    }
  }


  toggleLike() {
    this.isLiked = !this.isLiked;
    this.icon = this.isLiked ? carrotTouchedIcon : carrotIcon;

    const url = this.isLiked
      ? `/api/posts/${this.post.id}/like`
      : `/api/posts/${this.post.id}/unlike`;

    console.log("происходит морковканье поста с ид", this.post.id, url)

    // this.http.post(url, {}).subscribe({
    //   next: () => {
    //     console.log('Лайк обновлен на сервере');
    //   },
    //   error: (err) => {
    //     console.error('Ошибка при обновлении лайка', err);
    //     this.isLiked = !this.isLiked;
    //   }
    // });
  }

}
