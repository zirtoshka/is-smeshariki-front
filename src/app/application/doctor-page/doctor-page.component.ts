import {Component, inject, OnInit} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {ApplicationForTreatment} from '../../model/application-for-treatment';
import {enumListToString, GeneralStatus} from '../../model/enums';
import {Propensity} from '../../model/propensity';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {HeaderComponent} from '../../header/header.component';
import {ApplicationCardComponent} from '../application-card/application-card.component';
import {PropensityCardComponent} from '../../propensity/propensity-card/propensity-card.component';
import {BasePage} from '../../base/base-page';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {PropensityFormComponent} from '../../propensity/propensity-form/propensity-form.component';
import {ApplicationFormComponent} from '../application-form/application-form.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ApplicationService} from '../../services/application.service';
import {Complaint} from '../../model/complaint';
import {getLogin} from '../../auth-tools/auth-utils';
import {ComplaintCardComponent} from '../../complaint/complaint-card/complaint-card.component';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [
    NzCardComponent,
    NgForOf,
    NzCardMetaComponent,
    NzButtonComponent,
    NgIf,
    NzSelectComponent,
    FormsModule,
    NzOptionComponent,
    NzSwitchComponent,
    HeaderComponent,
    ApplicationCardComponent,
    PropensityCardComponent,
    SearchFilterComponent,
    PropensityFormComponent,
    ApplicationFormComponent,
    ComplaintCardComponent
  ],
  providers: [NzModalService],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent extends BasePage<ApplicationForTreatment>  implements OnInit  {

  override action = "application"

  isMyApplications: boolean = false

  // currDoctorId = 303; //todo

  applicationService: ApplicationService = inject(ApplicationService);


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
      console.error("Ошибка при обновлении:", error);
    });
  }


  handleTake(item: ApplicationForTreatment) {
    item.doctor = getLogin();
    console.log(this.itemForEdit)
    this.onEdit(item, item.id).then(() => {
      console.log('взял в обработку', item.doctor, ' заявку', item.id);
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
    this.applicationService.getApplications(
      {
        page: this.page,
        statuses: enumListToString(this.selectedStatuses),
        isMine: this.isMyApplications ? this.isMyApplications : undefined
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => ApplicationForTreatment.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationService.error('Держите меня, я падаю…', 'не удалось загрузить данные');
        }
      });
  }

  override formatDataFromBackend(data: ApplicationForTreatment) {
    return ApplicationForTreatment.fromBackend(data);
  }

}
