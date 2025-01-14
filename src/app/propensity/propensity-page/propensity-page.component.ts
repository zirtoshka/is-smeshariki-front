import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BanCardComponent} from "../../ban/ban-card/ban-card.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {Propensity} from '../../propensity';
import {BasePage} from '../../base/base-page';
import {PropensityCardComponent} from '../propensity-card/propensity-card.component';
import {PropensityFormComponent} from '../propensity-form/propensity-form.component';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  imports: [
    BanCardComponent,
    NgForOf,
    NgIf,
    NzSwitchComponent,
    CommonModule,
    PropensityCardComponent,
    PropensityFormComponent,
    NzButtonComponent,
    NzCardComponent,
    NzIconDirective
  ],
  providers: [NzModalService], //todo
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-propensity-page',
  standalone: true,
  styleUrl: './propensity-page.component.css',
  templateUrl: './propensity-page.component.html',
})
export class PropensityPageComponent extends BasePage<Propensity>{




  constructor() {
    super();
    this.items= [
      new Propensity(1, 'Склонность к меду', 'Любовь к меду и употреблению меда.'),
      new Propensity(2, 'Склонность к грустному вайбу', 'Увлечение грустным вайбом.'),
      new Propensity(3, 'Склонность к спаму', 'Интерес к активному образу спама.'),
    ];
  }


}
