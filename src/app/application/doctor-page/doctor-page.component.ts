import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ApplicationForTreatment} from '../../model/application-for-treatment';
import {enumListToString, GeneralStatus} from '../../model/enums';
import {FormsModule} from '@angular/forms';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {ApplicationCardComponent} from '../application-card/application-card.component';
import {BasePage} from '../../base/base-page';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {ApplicationFormComponent} from '../application-form/application-form.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ApplicationFacade} from '../../facade/application.facade';
import {AuthService} from '../../auth-tools/auth.service';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NzSwitchComponent,
    ApplicationCardComponent,
    SearchFilterComponent,
    ApplicationFormComponent,

  ],
  providers: [NzModalService],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent extends BasePage<ApplicationForTreatment>  implements OnInit  {

  override action = "application"

  isMyApplications: boolean = false

  applicationFacade: ApplicationFacade = inject(ApplicationFacade);
  private authService = inject(AuthService);


  override preparing(item: any): any {
    return new ApplicationForTreatment(item).toBackendJson();
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  handleStatusConfirmed(event: { item: ApplicationForTreatment; status: GeneralStatus }) {
    event.item.status = event.status;
    this.onEdit(event.item, event.item.id).then(() => {
      console.log('Подтвержден статус:', event.status, 'для заявку:', event.item.id);
    }).catch((error) => {
      this.notificationService.handleErrorAsync(error);
    });
  }

  handleTake(item: ApplicationForTreatment) {
    const newItem = new ApplicationForTreatment(item);
    newItem.doctor = this.authService.currentLogin ?? '';
    this.onEdit(newItem, newItem.id).then(() => {
      console.log('взял в обработку', item.doctor, ' заявку', item.id);
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
    this.applicationFacade.getApplications(
      {
        page: this.page,
        statuses: enumListToString(GeneralStatus, this.selectedStatuses),
        isMine: this.isMyApplications ? this.isMyApplications : undefined
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => ApplicationForTreatment.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          this.notificationService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }

  override formatDataFromBackend(data: ApplicationForTreatment) {
    return ApplicationForTreatment.fromBackend(data);
  }

  protected readonly GeneralStatus = GeneralStatus;
}
