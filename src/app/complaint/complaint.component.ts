import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {PostComponent} from "../post/post.component";
import {Complaint} from '../complaint';
import {FormsModule} from '@angular/forms';
import {Post} from '../post';
import {GeneralStatus} from '../enums';
import {CommentComponent} from '../comment/comment.component';
import {CommentS} from '../comment';
import {ContentBase} from '../content-base';

@Component({
  selector: 'app-complaint',
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
    PostComponent,
    FormsModule,
    CommentComponent
  ],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent extends ContentBase {
  @Input() complaint!: Complaint;
  generalStatuses = Object.values(GeneralStatus);


  onStatusChange(newStatus: GeneralStatus): void {
    this.complaint.status = newStatus;
  }


  confirmComplaintStatus(): void {
    console.log(`Подтверждение статуса: ${this.complaint.status} для жалобы ${this.complaint.id}`);
    //todo
    // this.someService.updateComplaintStatus(complaintId, complaint.status).subscribe();
  }


  assignAdminToComplaint(event: any): void {
    let adminId = event.emit("adminId")
    console.log(`Администратор c id ${adminId} назначен на жалобу №${this.complaint.id}`);
    //todo
    // this.someService.assignAdmin(complaintId, 999).subscribe();
  }

}
