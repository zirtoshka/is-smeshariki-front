import {GeneralStatus} from '../enums';
import {BaseService} from './base.service';
import {inject} from '@angular/core';

export abstract class BasePage<T> {
  action!: string;
  items: T[] = [];

  itemForEdit: T | null = null;

  isEditMode: boolean = false;
  isVisible: boolean = false;
  baseService: BaseService = inject(BaseService);

  openAddForm() {
    this.itemForEdit = null
    this.isEditMode = false
    this.isVisible = true

  }


  async onSave(item: any) {
    console.log("это сохранение ");
    console.log(item);
    item = {
      violationType: 'SPAM',
      description: 'НУ ЭТО СПАМ!',
      post: 1,
      comment: null,
      status: 'NEW',
    };
    try {
      const response = await this.baseService.createItem<any>(this.action, item)

      console.log('Жалоба отправлена:', response);
    } catch (error) {
      console.error('Ошибка при отправке жалобы:', error);
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
