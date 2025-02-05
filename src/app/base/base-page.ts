import {GeneralStatus, getEnumKeyByValue} from '../model/enums';
import {BaseService} from './base.service';
import {Directive, HostListener, inject} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {HasId} from '../model/hasid';
import {Complaint} from '../model/complaint';


@Directive()
export abstract class BasePage<T extends HasId> {
  action!: string;
  items: T[] = [];


  loading = true;
  allLoaded = false;

  page = 0;

  itemForEdit: T | null = null;

  isEditMode: boolean = false;
  isVisible: boolean = false;
  baseService: BaseService<T> = inject(BaseService <T>);
  protected notificationService = inject(NzNotificationService);


  selectedStatuses: GeneralStatus[] = [];
  searchQuery: string = '';


  openAddForm() {
    this.itemForEdit = null
    this.isEditMode = false
    this.isVisible = true

  }

  preparing(item: any): any {
    return item;
  }

  async onSave(item: any) {
    let data = this.preparing(item)
    try {
      const response = await this.baseService.createItem<any>(this.action, data)
      this.items.push(response as T);
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


  async onEdit(item: any, id?: number) {
    let data = this.preparing(item);
    console.log(item)
    console.log(data)
    console.log(getEnumKeyByValue(GeneralStatus, item.status))
    const complaintId = id ?? this.itemForEdit?.id;
    try {
      const response = await this.baseService.updateItem<any>(this.action, data, complaintId);
      this.replaceItemById(complaintId, response as T);
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

  async handleDelete(item: T) {
    console.log('Удалить:', item);
    const complaintId = item.id
    // const complaintId = item.id ?? this.itemForEdit?.id;
    try {
      const response = await this.baseService.deleteItem<any>(this.action, complaintId);
      this.items = this.items.filter(i => i !== item);
      if (!this.allLoaded) {
        this.fetchDataFromServer(true)
      }
      this.notificationService.success(
        "Хо-хо!",
        "удаление успешно"
      )
    } catch (error: any) {
      this.notificationService.error("Ёлки-иголки",
        error
      )
    }
    this.isVisible = false
  }

  handleSearchChange(searchData: { query: string; statuses: GeneralStatus[] }) {
    this.searchQuery = searchData.query
    this.selectedStatuses = searchData.statuses
    this.page = 0;
    this.allLoaded = false
    // this.items = []
    this.fetchDataFromServer(true);
  }


  fetchHelper(newItems: T[], replacementIsNeeded: boolean = false) {
    if (replacementIsNeeded) {
      this.items = []
    }
    const uniqueNewItems = newItems.filter(
      (newItem) => !this.items.some((existingItem) => existingItem.id === newItem.id)
    );
    if (newItems.length) {
      this.items = [...this.items, ...uniqueNewItems];
      this.page++;
    } else {
      this.allLoaded = true;
    }
    this.loading = false;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.loading || this.allLoaded) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 200;

    if (scrollPosition >= threshold) {
      this.loading = true;
      this.fetchDataFromServer();
    }
  }


  replaceItemById(id: number | null | undefined, newItem: T) {
    if (!id) return
    newItem.id = id;
    newItem = this.formatDataFromBackend(newItem)
    this.items = this.items.map(item =>
      item.id === id ? {...item, ...newItem} : item
    );
  }

  formatDataFromBackend(data: any) {
    return data;
  }

  fetchDataFromServer(replacementIsNeeded: boolean = false) {
  }
}
