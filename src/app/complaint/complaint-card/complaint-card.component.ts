import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {PostCardComponent} from "../../post-card/post-card.component";
import {Complaint} from '../../complaint';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../../enums';
import {CommentComponent} from '../../comment/comment.component';
import {ContentBase} from '../../content-base';
import {NzIconDirective} from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-complaint-card',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzButtonComponent,
    NzCardComponent,
    NzCardMetaComponent,
    NzOptionComponent,
    NzSelectComponent,
    NzSwitchComponent,
    PostCardComponent,
    FormsModule,
    CommentComponent,
    NzIconDirective
  ],
  templateUrl: './complaint-card.component.html',
  styleUrl: './complaint-card.component.css'
})
export class ComplaintCardComponent extends ContentBase<Complaint> {
  @Input() declare item: Complaint;
  @Output() override edit = new EventEmitter<Complaint>();
  @Output() override delete = new EventEmitter<Complaint>();

  generalStatuses = Object.values(GeneralStatus);


  onStatusChange(newStatus: GeneralStatus): void {
    this.item.status = newStatus;
  }


  confirmComplaintStatus(): void {
    console.log(`Подтверждение статуса: ${this.item.status} для жалобы ${this.item.id}`);
    //todo
    // this.someService.updateComplaintStatus(complaintId, complaint-card.status).subscribe();
  }


  assignAdminToComplaint(event: any): void {
    let adminId = event.emit("adminId")
    console.log(`Администратор c id ${adminId} назначен на жалобу №${this.item.id}`);
    //todo
    // this.someService.assignAdmin(complaintId, 999).subscribe();
  }

  protected readonly GeneralStatus = GeneralStatus;
}
