import {Component} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {ApplicationForTreatment} from '../../application-for-treatment';
import {GeneralStatus} from '../../enums';
import {Propensity} from '../../propensity';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {HeaderComponent} from '../../header/header.component';
import {ApplicationCardComponent} from '../application-card/application-card.component';
import {PropensityCardComponent} from '../../propensity/propensity-card/propensity-card.component';
import {BasePage} from '../../base/base-page';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';

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
    SearchFilterComponent
  ],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent extends BasePage<ApplicationForTreatment> {
  isMyApplications: boolean = false

  currDoctorId = 303; //todo

  constructor() {
    super();
    this.items = this.applications;
  }

  propensityList: Propensity[] = [
    new Propensity(1, 'грустный вайб', 'Пациент нуждается в срочном лечении'),
    new Propensity(2, 'избыток меда', 'Показатели стабильны, но необходима проверка'),
    new Propensity(3, 'странный вайб', 'чзх')


  ];
  applications: ApplicationForTreatment[] = [
    new ApplicationForTreatment(
      1,
      1,
      null,
      null,
      GeneralStatus.new,
      0
    ),
    new ApplicationForTreatment(
      2,
      null,
      1,
      221,
      GeneralStatus.canceled,
      1
    ),
    new ApplicationForTreatment(
      3,
      null,
      3,
      303,
      GeneralStatus.inProgress,
      2
    ),
  ];


  onToggleChange(): void {
    console.log(this.isMyApplications ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }


  handleSearchChange(searchData: { query: string; statuses: GeneralStatus[] }) {
    console.log('Поиск:', searchData.query);
    console.log('Статусы:', searchData.statuses);

    // Логика для отправки данных на сервер
    this.fetchDataFromServer(searchData.query, searchData.statuses);
  }

  // Пример функции для отправки данных на сервер
  fetchDataFromServer(query: string, statuses: GeneralStatus[]) {
    // Пример запроса. Настройте ваш HttpClient здесь.
    console.log(`Отправка данных на сервер: query="${query}", statuses="${statuses}"`);
  }


}
