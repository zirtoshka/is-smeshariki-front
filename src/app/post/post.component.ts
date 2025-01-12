import {Component, Input, OnInit} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Post} from '../post';
import {PostService} from '../diary/post.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzTagComponent
  ],
  providers:[PostService],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  @Input() post!: Post;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.post = this.postService.getPostById(id)!;
    }
  }
}
