export abstract class BasePageComponent<T> {
  items: T[] = [];

  handleEdit(item: T): void {
    console.log('Редактировать:', item);
  }

  handleDelete(item: T): void {
    console.log('Удалить:', item);
    this.items = this.items.filter(i => i !== item);
  }
}
