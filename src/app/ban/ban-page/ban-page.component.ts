import {Component, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {FormsModule} from '@angular/forms';
import {BanCardComponent} from '../ban-card/ban-card.component';
import {Ban} from '../../ban';
import {PropensityCardComponent} from '../../propensity/propensity-card/propensity-card.component';
import {BasePage} from '../../base/base-page';
import {ApplicationFormComponent} from "../../application/application-form/application-form.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {SearchFilterComponent} from "../../search-filter/search-filter.component";
import {NzModalService} from 'ng-zorro-antd/modal';
import {BanFormComponent} from '../ban-form/ban-form.component';

@Component({
  selector: 'app-ban-card-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzSwitchComponent,
    FormsModule,
    BanCardComponent,
    PropensityCardComponent,
    ApplicationFormComponent,
    NzButtonComponent,
    SearchFilterComponent,
    BanFormComponent
  ],
  providers: [NzModalService,  { provide: LOCALE_ID, useValue: 'ru' }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './ban-page.component.html',
  styleUrl: './ban-page.component.css'
})
export class BanPageComponent extends BasePage<Ban> {
  isMyBans = false;

  constructor() {
    super();
    this.items = [
      new Ban(1, "fofoofofof", 1, 101, 3, '2025-01-10', '2025-01-11')
    ];
  }

  onToggleChange() {
    //todo
    console.log(this.isMyBans ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }

}
