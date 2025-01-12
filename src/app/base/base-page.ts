
export abstract class BasePage<T> {
  items: T[] = [];

  itemForEdit:T|null=null;

  isEditMode: boolean = false;
  isVisible: boolean = false;

  openAddForm() {
    this.itemForEdit=null
    this.isEditMode=false
    this.isVisible=true

  }


  onSave(item:any) {
    console.log("это сохранение ");
    console.log(item);
    this.isVisible=false
  }

  onCancel() {
    this.isVisible=false
    this.itemForEdit=null
  }

  handleEdit(item: T): void {
    this.itemForEdit=item
    this.isVisible=true
    this.isEditMode=true
    console.log('Редактировать:', item);
  }

  handleDelete(item: T): void {
    console.log('Удалить:', item);
    this.items = this.items.filter(i => i !== item);
  }
}
