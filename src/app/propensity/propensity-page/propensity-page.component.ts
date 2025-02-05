import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {BanCardComponent} from "../../ban/ban-card/ban-card.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {Propensity} from '../../model/propensity';
import {BasePage} from '../../base/base-page';
import {PropensityCardComponent} from '../propensity-card/propensity-card.component';
import {PropensityFormComponent} from '../propensity-form/propensity-form.component';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzModalService} from 'ng-zorro-antd/modal';
import {PropensityService} from '../../services/propensity.service';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {BanFormComponent} from '../../ban/ban-form/ban-form.component';

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
    NzIconDirective,
    SearchFilterComponent,
    BanFormComponent
  ],
  providers: [NzModalService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-propensity-page',
  standalone: true,
  styleUrl: './propensity-page.component.css',
  templateUrl: './propensity-page.component.html',
})
export class PropensityPageComponent extends BasePage<Propensity> implements OnInit {

  override action = "propensity";

  propensityService: PropensityService = inject(PropensityService);



  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override preparing(item: Propensity): any {
    return new Propensity(item).toBackendJson();
  }


  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.propensityService.getPropensities(
      {
        page: this.page,
        filter: this.searchQuery,
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Propensity.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }


}
