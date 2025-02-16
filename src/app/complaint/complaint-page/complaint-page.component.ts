import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {Complaint} from '../../model/complaint';
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
import {ComplaintService} from '../../services/complaint.service';
import {enumListToString, GeneralStatus} from '../../model/enums';
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
    ComplaintFormComponent,
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


  override selectedStatuses: GeneralStatus[]=[];

  override preparing(item: any): any {
    return new Complaint(item).toBackendJson();
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  handleStatusConfirmed(event: { item: Complaint; status: GeneralStatus }) {
    event.item.status = event.status;
    this.onEdit(event.item, event.item.id).then(() => {
      console.log('Подтвержден статус:', event.status, 'для жалобы:', event.item.id);
    }).catch((error) => {
      console.error("Ошибка при обновлении:", error);
    });
  }

  handleTake(item: Complaint) {
    const newItem = new Complaint(item);
    newItem.adminLogin = getLogin();
    this.onEdit(newItem, newItem.id).then(() => {
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
        statuses: enumListToString(GeneralStatus, this.selectedStatuses),
        isMine: this.isMyComplaints ? this.isMyComplaints : undefined
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Complaint.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }

  override formatDataFromBackend(data: Complaint) {
    return Complaint.fromBackend(data);
  }

  protected readonly GeneralStatus = GeneralStatus;
}
