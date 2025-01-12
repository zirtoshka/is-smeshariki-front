import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BanCardComponent} from "../../ban/ban-card/ban-card.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {Propensity} from '../../propensity';
import {BasePageComponent} from '../../base/base-page.component';
import {PropensityCardComponent} from '../propensity-card/propensity-card.component';

@Component({
  selector: 'app-propensity-page',
  standalone: true,
  imports: [
    BanCardComponent,
    NgForOf,
    NgIf,
    NzSwitchComponent,
    CommonModule,
    PropensityCardComponent
  ],
  templateUrl: './propensity-page.component.html',
  styleUrl: './propensity-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropensityPageComponent extends BasePageComponent<Propensity>{

  constructor() {
    super();
    this.items= [
      new Propensity(1, 'Склонность к меду', 'Любовь к меду и употреблению меда.'),
      new Propensity(2, 'Склонность к грустному вайбу', 'Увлечение грустным вайбом.'),
      new Propensity(3, 'Склонность к спаму', 'Интерес к активному образу спама.'),
    ];
  }

}
