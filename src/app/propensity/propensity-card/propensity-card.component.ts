import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Propensity} from '../../model/propensity';
import {BaseCard} from '../../base/base-card';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-propensity-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzIconDirective,
    CommonModule
  ],
  templateUrl: './propensity-card.component.html',
  styleUrl: './propensity-card.component.css'
})
export class PropensityCardComponent extends BaseCard<Propensity>{
  @Input() declare item: Propensity;
  @Output() override edit = new EventEmitter<Propensity>();
  @Output() override delete = new EventEmitter<Propensity>();

}
