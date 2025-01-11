import { Component } from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {Complaint} from '../complaint';
import {GeneralStatus, ViolationType} from '../enums';
import {FormsModule} from '@angular/forms';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-complaint-page',
  standalone: true,
  imports: [
    NzCardComponent,
    NgForOf,
    NzCardMetaComponent,
    FormsModule,
    NzOptionComponent,
    NzSelectComponent,
    NzButtonComponent,
    NgIf,
    NzSwitchComponent,
    HeaderComponent
  ],
  templateUrl: './complaint-page.component.html',
  styleUrl: './complaint-page.component.css'
})
export class ComplaintPageComponent {
  isMyComplaints=false;
  complaints: Complaint[] = [
    new Complaint(
      1,
      ViolationType.SPAM,
      'Пост с рекламой товаров',
      null,
      101,
      null,
      GeneralStatus.new,
      '2025-01-10',
      ''
    ),
    new Complaint(
      2,
      ViolationType.eroticContent,
      'Оскорбительный комментарий',
      301,
      null,
      202,
      GeneralStatus.done,
      '2025-01-09',
      '2025-01-10'
    ),
    new Complaint(
      3,
      ViolationType.fraudOrMisleading,
      'Нецензурная лексика в посте',
      null,
      null,
      203,
      GeneralStatus.inProgress,
      '2025-01-08',
      ''
    ),
  ];

  generalStatuses = Object.values(GeneralStatus);

  onStatusChange(complaintId: number, newStatus: GeneralStatus): void {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (complaint) {
      complaint.status = newStatus;
    }
  }

  confirmComplaintStatus(complaintId: number): void {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (complaint) {
      console.log(`Подтверждение статуса: ${complaint.status} для жалобы ${complaintId}`);
      //todo
      // this.someService.updateComplaintStatus(complaintId, complaint.status).subscribe();
    }
  }

  onToggleChange(){
    //todo
    console.log(this.isMyComplaints ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }

  assignAdminToComplaint(complaintId: number): void {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (complaint) {
      complaint.adminId = 999;
      console.log(`Администратор назначен на жалобу №${complaintId}`);
      //todo
      // this.someService.assignAdmin(complaintId, 999).subscribe();
    }
  }
}
