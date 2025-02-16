import {Component, Input} from '@angular/core';
import {Post} from '../model/post';
import {NgIf} from '@angular/common';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Router} from '@angular/router';
import {PostTagComponent} from '../post-tag/post-tag.component';

@Component({
  selector: 'app-post-meta',
  standalone: true,
  imports: [
    NgIf,
    NzAvatarComponent,
    NzCardComponent,
    NzIconDirective,
    NzTagComponent,
    PostTagComponent
  ],
  templateUrl: './post-meta.component.html',
  styleUrl: './post-meta.component.css'
})
export class PostMetaComponent {
  @Input() post!: Post;
  constructor(private router: Router) {}


  navigateToPost(postId: number): void {
    console.log(postId)
    this.router.navigate(['/post-card', postId]);
  }
}
