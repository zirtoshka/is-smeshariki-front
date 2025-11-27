import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {Post} from '../model/post';
import {map, Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {
  private readonly baseService = inject(BaseService<Post>);

  getPosts(options: Partial<{
    filter: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}, endpoint = ''): Observable<PaginatedResponse<Post>> {
    const defaultOptions = {
      filter: null,
      sortField: 'creationDate',
      ascending: true,
      page: 0,
      size: 2,
    };
    const params = {...defaultOptions, ...options};

    return this.baseService.getItems<Post>(`post${endpoint}`, params).pipe(
      map(response => ({
        ...response,
        content: response.content.map(data => Post.fromBackend(data))
      }))
    );
  }

  getFeed(options: Partial<{
    filter: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}): Observable<PaginatedResponse<Post>> {
    return this.getPosts(options, '/feed');
  }

  getDiary(options: Partial<{
    filter: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}): Observable<PaginatedResponse<Post>> {
    return this.getPosts(options, '/diary');
  }

  getPostById(id: number): Observable<Post> {
    return this.baseService.getItemById<Post>('post', id).pipe(
      map(response => Post.fromBackend(response))
    );
  }

  downloadImage(filename: string) {
    const params = {fileName: filename};
    return this.baseService.getByParams('post/download', params) as Observable<Blob>;
  }

  async createPost(post: FormData): Promise<Post> {
    const response = await this.baseService.createItem<Post>('post', post);
    return Post.fromBackend(response);
  }
}
