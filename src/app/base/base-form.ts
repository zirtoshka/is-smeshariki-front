import {EventEmitter, Input, Output} from '@angular/core';
import {HasId} from '../hasid';

export abstract class BaseForm<T extends HasId> {
  item: T | null = null;
  onSave = new EventEmitter<T>();
  onEdit = new EventEmitter<T>();
  onCancel = new EventEmitter<void>();

  isEditMode: boolean = false;
  isVisible: boolean = false;

  validateForm: any;

  save() {
    if (this.validateForm.valid) {
      const data: T = this.validateForm.value as T;
      if (this.isEditMode) {
        this.onEdit.emit(data);
      } else {
        this.onSave.emit(data);
      }
    }
  }

  cancel() {
    this.item = null
    this.isVisible = false;
    this.onCancel.emit();
  }

}
