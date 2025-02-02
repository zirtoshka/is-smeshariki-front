import {EventEmitter, Input, Output} from '@angular/core';

export abstract class BaseForm<T> {
  item: T | null = null;
  onSave = new EventEmitter<T>();
  onCancel = new EventEmitter<void>();

  isEditMode: boolean = false;
  isVisible: boolean = false;

  validateForm: any;

  save() {
    if (this.validateForm.valid) {
      const data: T = this.validateForm.value as T;
      this.onSave.emit(data);
    }
  }

  cancel() {
    this.item = null
    this.isVisible = false;
    this.onCancel.emit();
  }

}
