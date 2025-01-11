import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  editSmesharik(name: string, login: string, email: string) {
    console.log("edit Smesharik", name, login, email);
  }
}
