import {Component, inject, Input} from '@angular/core';
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent} from 'ng-zorro-antd/menu';
import {ComplaintFormComponent} from '../complaint/complaint-form/complaint-form.component';
import {BaseService} from '../base/base.service';
import {Complaint} from '../model/complaint';
import {NotificationService} from '../services/notification.service';

@Component({
  selector: 'app-dop-menu',
  standalone: true,
  imports: [
    NzDropDownDirective,
    NzIconDirective,
    NzDropdownMenuComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    ComplaintFormComponent
  ],
  templateUrl: './dop-menu.component.html',
  styleUrl: './dop-menu.component.css'
})
export class DopMenuComponent {
  @Input() postId!: number;
  @Input() commentId!: number;

  baseService: BaseService<Complaint> = inject(BaseService);
  protected notificationService = inject(NotificationService);

  isComplaintVisible: boolean = false;
  openComplaintForm(){
    this.isComplaintVisible=true;
  }

  onCancel() {
    this.isComplaintVisible = false
  }

  async onSave(item: any) {
    let data = new Complaint(item).toBackendJson();
    try {
      const response = await this.baseService.createItem<any>("complaint", data)
      this.notificationService.handleSuccess(
        "Ай молодца!",
        "жалоба отправлена"
      )
    } catch (error: any) {
      this.notificationService.handleErrorAsync(
        error
      )
    }
    this.isComplaintVisible = false
  }
}
