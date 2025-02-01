import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
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
export class ComplaintPageComponent extends BasePage<Complaint> {
  override action="complaint"
  isMyComplaints = false;

  constructor() {
    super();
    this.items = this.complaints;
  }

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
      "301",
      null,
      1,
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
      3,
      GeneralStatus.inProgress,
      '2025-01-08',
      ''
    ),
  ];


  onToggleChange() {
    //todo
    console.log(this.isMyComplaints ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }



}
