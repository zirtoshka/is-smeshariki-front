import {Post} from '../model/post';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';
import {inject} from '@angular/core';
import {BaseService} from '../base/base.service';

export class PostService {

  private baseService = inject(BaseService<Post>);

  getPosts(options: Partial<{
    filter: string;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}, endpoint: string = ""): Observable<PaginatedResponse<Complaint>> {
    const defaultOptions = {
      filter: null,
      sortField: "creationDate",
      ascending: true,
      page: 0,
      size: 2,
    };
    const params = {...defaultOptions, ...options};
    return this.baseService.getItems(`post${endpoint}`, params);
  }


  getFeed(options: Partial<{
    filter: string;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}) {
    return this.getPosts(options, "/feed")
  }

  getDiary(options: Partial<{
    filter: string;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}) {
    return this.getPosts(options, "/diary")
  }


  getPostById(id: number): Observable<Post> {
    return this.baseService.getItemById("post", id);
    // return this.posts.filter(i=> i.id==id)[0];
  }
}
