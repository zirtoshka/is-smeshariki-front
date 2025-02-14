import {Component, inject, Input} from '@angular/core';
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {ComplaintFormComponent} from '../complaint/complaint-form/complaint-form.component';
import {ComplaintService} from '../services/complaint.service';
import {BaseService} from '../base/base.service';
import {Complaint} from '../model/complaint';
import {NotificationCustomService} from '../notification-custom.service';
import {ApplicationForTreatment} from '../model/application-for-treatment';

@Component({
  selector: 'app-dop-menu',
  standalone: true,
  imports: [
    NzDropDownDirective,
    NzIconDirective,
    NzDropdownMenuComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSubMenuComponent,
    NzButtonComponent,
    ComplaintFormComponent
  ],
  templateUrl: './dop-menu.component.html',
  styleUrl: './dop-menu.component.css'
})
export class DopMenuComponent {
  @Input() postId!: number;
  @Input() commentId!: number;

  baseService: BaseService<Complaint> = inject(BaseService);
  protected notificationCustomService = inject(NotificationCustomService);


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
      this.notificationCustomService.handleSuccess(
        "Ай молодца!",
        "жалоба отправлена"
      )
    } catch (error: any) {
      this.notificationCustomService.handleErrorAsync(
        error
      )
    }
    this.isComplaintVisible = false
  }
}
