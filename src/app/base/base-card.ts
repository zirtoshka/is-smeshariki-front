import {EventEmitter, Input, Output} from '@angular/core';

export abstract class BaseCard<T> {
  item!: T;
  edit = new EventEmitter<T>();
  delete = new EventEmitter<T>();
  takeIt = new EventEmitter<T>();

  onEdit(item: T): void {
    this.edit.emit(item);
  }

  onDelete(item: T): void {
    this.delete.emit(item);
  }

  onTakeIt(item: T): void {
    this.takeIt.emit(item);
  }


}
