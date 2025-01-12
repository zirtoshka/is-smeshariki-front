import {EventEmitter, Input, Output} from '@angular/core';

export abstract class BaseForm<T> {
  item: T | null = null;
  onSave = new EventEmitter<any>();
  onCancel = new EventEmitter<void>();

  isEditMode: boolean = false;
  isVisible: boolean = false;

  validateForm: any;

  save() {
    if (this.validateForm.valid) {
      this.onSave.emit(this.validateForm.value);
    }
  }

  cancel() {
    this.item = null
    this.isVisible = false;
    this.onCancel.emit();
  }

}
