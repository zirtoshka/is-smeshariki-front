import {Post} from '../model/post';
import {lastValueFrom, Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';
import {inject} from '@angular/core';
import {BaseService} from '../base/base.service';
import {HttpClient} from '@angular/common/http';

export class PostService {

  private baseService = inject(BaseService<Post>);
  private http: HttpClient = inject(HttpClient);

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

  downloadImage(filename: string) {
    const params = {
      fileName: filename
    }
    return this.baseService.getByParams("post/download", params) as Observable<Blob>;
  }

  createPost(post: FormData) {
    return this.baseService.createItem<Post>("post", post);
  }


}
