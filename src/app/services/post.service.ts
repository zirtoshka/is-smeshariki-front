import {Post} from '../model/post';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';
import {inject} from '@angular/core';
import {BaseService} from '../base/base.service';

export class PostService {
  posts: Post[] = [];
  //   Array.from({ length: 100 }, (_, i) => {
  //   const id = i + 1;
  //   const authorId = Math.floor(Math.random() * 50) + 1;
  //   const liked = Math.random() < 0.5;
  //   const shared = Math.random() < 0.5;
  //   const text = `Текст поста ${id}. ` +
  //     'Вот так всегда: для кого-то балласт, а для кого-то сокровище.\n' +
  //     'А всё-таки, наверно, хорошо знать, что там, где горит свет, кто-то может сидеть и думать о тебе.' +
  //     'Солнце светит — хорошо, не светит — тоже хорошо, я сам себе солнце.'
  //       .repeat(20).slice(0, 10000);
  //   const imageUrl = '';
  //   const createdAt = new Date(Date.now() - id * 10000000).toISOString();
  //   const updatedAt = new Date(Date.now() - id * 5000000).toISOString();
  //
  //   return new Post(id, authorId, liked, shared, text, imageUrl, createdAt, updatedAt);
  // });

  private baseService = inject(BaseService);

  getPosts(options: Partial<{
    filter: string;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}): Observable<PaginatedResponse<Complaint>> {
    const defaultOptions = {
      filter: null,
      sortField: "creationDate",
      ascending: true,
      page: 0,
      size: 2,
    };

    const params = { ...defaultOptions, ...options };

    return this.baseService.getItems("post/feed", params);
  }

  getPostById(id:number):Post{
    return this.posts.filter(i=> i.id==id)[0];
  }
}
