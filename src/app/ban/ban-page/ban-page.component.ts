import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {FormsModule} from '@angular/forms';
import {BanCardComponent} from '../ban-card/ban-card.component';
import {Ban} from '../../ban';
import {PropensityCardComponent} from '../../propensity/propensity-card/propensity-card.component';
import {BasePageComponent} from '../../base/base-page.component';

@Component({
  selector: 'app-ban-card-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzSwitchComponent,
    FormsModule,
    BanCardComponent,
    PropensityCardComponent
  ],
  templateUrl: './ban-page.component.html',
  styleUrl: './ban-page.component.css'
})
export class BanPageComponent extends BasePageComponent<Ban> {
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
