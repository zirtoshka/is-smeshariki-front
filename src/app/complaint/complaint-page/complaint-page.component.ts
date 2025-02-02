import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {Complaint} from '../../complaint';
import {GeneralStatus, ViolationType} from '../../enums';
import {FormsModule} from '@angular/forms';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {HeaderComponent} from '../../header/header.component';
import {PostCardComponent} from '../../post-card/post-card.component';
import {ComplaintCardComponent} from '../complaint-card/complaint-card.component';
import {PropensityCardComponent} from '../../propensity/propensity-card/propensity-card.component';
import {BasePage} from '../../base/base-page';
import {ApplicationCardComponent} from '../../application/application-card/application-card.component';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {ApplicationFormComponent} from '../../application/application-form/application-form.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ComplaintFormComponent} from '../complaint-form/complaint-form.component';
import {BaseService} from '../../base/base.service';
import {ComplaintService} from '../../complaint.service';

@Component({
  selector: 'app-complaint-card-page',
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
    HeaderComponent,
    PostCardComponent,
    ComplaintCardComponent,
    PropensityCardComponent,
    ApplicationCardComponent,
    SearchFilterComponent,
    ApplicationFormComponent,
    ComplaintFormComponent
  ],
  providers: [NzModalService],
  templateUrl: './complaint-page.component.html',
  styleUrl: './complaint-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ComplaintPageComponent extends BasePage<Complaint> implements OnInit {
  override action = "complaint"
  isMyComplaints = false;

  complaintService: ComplaintService = inject(ComplaintService);


  override preparing(item: any): any {
    const complaint = new Complaint(
      item.id,
      item.violationType,
      item.description,
      item.adminLogin,
      item.postId,
      item.commentId,
      item.status,
      item.creationDate,
      item.closingDate
    );
    return complaint.toBackendJson();
  }

  ngOnInit(): void {
    this.complaintService.getComplaints().subscribe({
      next: (response) => {
        this.items = response.content.map(Complaint.fromBackend);
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке жалоб:', err);
        this.notificationService.error('Ошибка', 'Не удалось загрузить данные');
      }
    });
  }


  onToggleChange() {
    //todo
    console.log(this.isMyComplaints ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }


}
