import { Component } from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {ApplicationForTreatment} from '../application-for-treatment';
import {GeneralStatus} from '../enums';
import {Propensity} from '../propensity';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {HeaderComponent} from '../header/header.component';

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
    HeaderComponent
  ],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent {
  isMyApplications: boolean = true

  generalStatuses = Object.values(GeneralStatus);

  propensityList:Propensity[]=[
    new Propensity(1, 'грустный вайб', 'Пациент нуждается в срочном лечении'),
    new Propensity(2, 'избыток меда', 'Показатели стабильны, но необходима проверка'),
    new Propensity(3, 'странный вайб', 'чзх')



  ];
  applications: ApplicationForTreatment[] = [
    new ApplicationForTreatment(
      1,
      101,
      null,
      null,
      GeneralStatus.new,
      0
    ),
    new ApplicationForTreatment(
      2,
      null,
      202,
      221,
      GeneralStatus.canceled,
      1
    ),
    new ApplicationForTreatment(
      3,
      null,
      null,
      303,
      GeneralStatus.inProgress,
      2
    ),
  ];

  approveApplication(id: number): void {
    const application = this.applications.find(app => app.id === id);
    if (application) {
      application.status = GeneralStatus.done;
    }
  }

  rejectApplication(id: number): void {
    const application = this.applications.find(app => app.id === id);
    if (application) {
      application.status = GeneralStatus.canceled;
    }
  }
  onStatusChange(applicationId: number, newStatus: GeneralStatus): void {
    const application = this.applications.find(app => app.id === applicationId);
    if (application) {
      application.status = newStatus;
    }
  }

  confirmStatus(applicationId: number): void {
    const application = this.applications.find(app => app.id === applicationId);
    if (application) {
      console.log(`Подтверждение статуса: ${application.status} для заявки ${applicationId}`);
      // this.doctorService.updateApplicationStatus(applicationId, application.status).subscribe();
    }
  }

  onToggleChange(): void {
    console.log(this.isMyApplications ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }

}
