import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Complaint} from '../../model/complaint';
import {FormsModule} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {ComplaintCardComponent} from '../complaint-card/complaint-card.component';
import {BasePage} from '../../base/base-page';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ComplaintFormComponent} from '../complaint-form/complaint-form.component';
import {ComplaintFacade} from '../../facade/complaint.facade';
import {enumListToString, GeneralStatus} from '../../model/enums';
import {AuthService} from '../../auth-tools/auth.service';

@Component({
  selector: 'app-complaint-card-page',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NzButtonComponent,
    NgIf,
    NzSwitchComponent,
    ComplaintCardComponent,
    SearchFilterComponent,
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

  complaintFacade: ComplaintFacade = inject(ComplaintFacade);
  private authService = inject(AuthService);


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
      this.notificationService.handleErrorAsync(error);
    });
  }

  handleTake(item: Complaint) {
    const newItem = new Complaint(item);
    newItem.adminLogin = this.authService.currentLogin ?? '';
    this.onEdit(newItem, newItem.id).then(() => {
      console.log('взял в обработку', item.adminLogin, ' жалобу', item.id);
    }).catch((error) => {
      this.notificationService.handleErrorAsync(error);
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
    this.complaintFacade.getComplaints(
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
          this.notificationService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }

  override formatDataFromBackend(data: Complaint) {
    return Complaint.fromBackend(data);
  }

  protected readonly GeneralStatus = GeneralStatus;
}
