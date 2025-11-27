import {inject, Injectable} from '@angular/core';
import {CarrotDataService} from '../data-access/carrot-data.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrotFacade {
  private readonly dataService = inject(CarrotDataService);

  isLikePost(id: number): Observable<boolean> {
    return this.dataService.isLiked({post: id});
  }

  isLikeComment(id: number): Observable<boolean> {
    return this.dataService.isLiked({comment: id});
  }

  setCarrotOnPost(id: number) {
    return this.dataService.setCarrot({post: id});
  }

  deleteCarrotOnPost(id: number) {
    return this.dataService.deleteCarrot({post: id});
  }

  setCarrotOnComment(id: number) {
    return this.dataService.setCarrot({comment: id});
  }

  deleteCarrotOnComment(id: number) {
    return this.dataService.deleteCarrot({comment: id});
  }
}
