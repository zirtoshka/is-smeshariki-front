import {Component, Input} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Post} from '../post';

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
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  // post:Post=new Post(1, 2, false, false,
  //   "sdksdlddssdsdklfklsdflksd",
  //   "sdfsdfsd", "02/12/23", "02/12/21")


  // post:Post=new Post(1, 2, true, false,
  //   "sdksdlddssdsdklfklsdflksd",
  //   "sdfsdfsd", "02/12/23", "02/12/21")

  @Input() post!: Post;
}
