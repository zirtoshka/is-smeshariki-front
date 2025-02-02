import {GeneralStatus} from '../enums';
import {BaseService} from './base.service';
import {inject} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {HasId} from '../hasid';

export abstract class BasePage<T extends HasId> {
  action!: string;
  items: T[] = [];

  itemForEdit: T | null = null;

  isEditMode: boolean = false;
  isVisible: boolean = false;
  baseService: BaseService = inject(BaseService);
  private notificationService = inject(NzNotificationService);


  openAddForm() {
    this.itemForEdit = null
    this.isEditMode = false
    this.isVisible = true

  }

  preparing(item: T): any {
    return item;
  }

  async onSave(item: any) {
    let data = this.preparing(item)
    try {
      const response = await this.baseService.createItem<any>(this.action, data)
      this.notificationService.success(
        "Ай молодца!",
        "сохраниние успешно"
      )
    } catch (error: any) {
      this.notificationService.error("Ёлки-иголки",
        error
      )
    }
    this.isVisible = false
  }


  async onEdit(item: any) {
    let data = this.preparing(item)
    try {
      const response = await this.baseService.updateItem<any>(this.action, data, this.itemForEdit?.id)
      this.notificationService.success(
        "Оба-на!",
        "обновление успешно"
      )
    } catch (error: any) {
      this.notificationService.error("Ёлки-иголки",
        error
      )
    }
    this.isVisible = false
  }


  onCancel() {
    this.isVisible = false
    this.itemForEdit = null
  }

  handleEdit(item: T): void {
    this.itemForEdit = item
    this.isVisible = true
    this.isEditMode = true
    console.log('Редактировать:', item);
  }

  handleDelete(item: T): void {
    console.log('Удалить:', item);
    this.items = this.items.filter(i => i !== item);
  }

  handleSearchChange(searchData: { query: string; statuses: GeneralStatus[] }) {
    console.log('Поиск:', searchData.query);
    console.log('Статусы:', searchData.statuses);
    this.fetchDataFromServer(searchData.query, searchData.statuses);
  }

  fetchDataFromServer(query: string, statuses: GeneralStatus[]) {
    console.log(`Отправка данных на сервер: query="${query}", statuses="${statuses}"`);
  }
}
