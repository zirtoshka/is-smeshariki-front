import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {Complaint} from '../../complaint';
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
import {ComplaintService} from '../../complaint.service';
import {enumListToString, GeneralStatus} from '../../enums';
import {getLogin} from '../../auth-tools/auth-utils';

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
      item.post,
      item.comment,
      item.status,
      item.creationDate,
      item.closingDate
    );
    return complaint.toBackendJson();
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  handleStatusConfirmed(event: { item: Complaint; status: GeneralStatus }) {
    event.item.status = event.status;
    console.log(this.itemForEdit)
    this.onEdit(event.item, event.item.id).then(() => {
      console.log('Подтвержден статус:', event.status, 'для жалобы:', event.item.id);
    }).catch((error) => {
      console.error("Ошибка при обновлении:", error);
    });
  }

  handleTake(item: Complaint) {
    item.adminLogin = getLogin();
    console.log(this.itemForEdit)
    this.onEdit(item, item.id).then(() => {
      console.log('взял в обработку', item.adminLogin, ' жалобу', item.id);
    }).catch((error) => {
      console.error("Ошибка при обновлении:", error);
    });
  }


  onToggleChange() {
    this.page = 0;
    this.allLoaded = false
    // this.items = []
    this.fetchDataFromServer(true);
    // console.log(this.isMyComplaints ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }


  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.complaintService.getComplaints(
      {
        page: this.page,
        description: this.searchQuery,
        statuses: enumListToString(this.selectedStatuses),
        isMine: this.isMyComplaints ? this.isMyComplaints : undefined
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(Complaint.fromBackend);
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationService.error('Держите меня, я падаю…', 'не удалось загрузить данные');
        }
      });
  }

}
