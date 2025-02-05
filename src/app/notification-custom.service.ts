import {inject, Injectable} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationCustomService {

  private notificationService = inject(NzNotificationService);

  handleErrorAsync(error: any, title: string="") {
    if (error?.error) {
      const errors = error.error;
      if (typeof errors === 'object') {
        Object.entries(errors).forEach(([field, message]) => {
          this.notificationService.error(
            "Ёлки-иголки",
            `${message}`,
            { nzDuration: 5000 }
          );
        });
      } else {
        this.showGenericError();
      }
    } else {
      this.showGenericError();
    }
  }

  handleSuccess(title: string, message: string) {
    this.notificationService.success(title, message, { nzDuration: 3000 });
  }

  private showGenericError() {
    this.notificationService.error(
      'ошибка',
      'что-то пошло не так, попробуйте позже.',
      {nzDuration: 5000}
    );
  }

}
