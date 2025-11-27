import {inject, Injectable} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationService = inject(NzNotificationService);

  showSuccess(message: string, title = 'Готово', duration = 3000): void {
    this.notificationService.success(title, message, {nzDuration: duration});
  }

  showError(message: string, title = 'Ёлки-иголки', duration = 5000): void {
    this.notificationService.error(title, message, {nzDuration: duration});
  }

  showWarning(message: string, title = 'Внимание', duration = 4000): void {
    this.notificationService.warning(title, message, {nzDuration: duration});
  }

  showInfo(message: string, title = 'Информация', duration = 3000): void {
    this.notificationService.info(title, message, {nzDuration: duration});
  }

  handleSuccess(title: string, message: string): void {
    this.showSuccess(message, title);
  }

  handleErrorAsync(error: unknown, title = 'Ёлки-иголки'): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error, title);
      return;
    }
    this.showExtractedMessages(error, title);
  }

  handleHttpError(error: HttpErrorResponse, title = 'Ёлки-иголки'): void {
    const payload = error.error ?? error.message ?? 'что-то пошло не так, попробуйте позже.';
    this.showExtractedMessages(payload, title);
  }

  private showExtractedMessages(error: unknown, title: string): void {
    const extractedMessages = this.extractMessages(error);
    if (extractedMessages.length) {
      extractedMessages.forEach(message => this.showError(message, title));
      return;
    }
    this.showGenericError();
  }

  private extractMessages(error: unknown): string[] {
    if (!error) {
      return [];
    }

    if (typeof error === 'string') {
      return [error];
    }

    if (Array.isArray(error)) {
      return error
        .map(item => typeof item === 'string' ? item : this.stringifyUnknown(item))
        .filter(Boolean) as string[];
    }

    if (typeof error === 'object') {
      const messages: string[] = [];
      Object.entries(error as Record<string, unknown>).forEach(([, value]) => {
        if (Array.isArray(value)) {
          value.forEach(message => messages.push(this.stringifyUnknown(message)));
        } else if (value) {
          messages.push(this.stringifyUnknown(value));
        }
      });
      return messages.filter(Boolean);
    }

    return [];
  }

  private stringifyUnknown(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof Error) {
      return value.message;
    }
    if (value && typeof value === 'object' && 'message' in value && typeof (value as any).message === 'string') {
      return (value as any).message;
    }
    return '';
  }

  private showGenericError(): void {
    this.showError('что-то пошло не так, попробуйте позже.', 'Ошибка');
  }
}
