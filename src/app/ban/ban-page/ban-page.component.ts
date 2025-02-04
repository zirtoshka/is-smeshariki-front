import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, LOCALE_ID, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {FormsModule} from '@angular/forms';
import {BanCardComponent} from '../ban-card/ban-card.component';
import {Ban} from '../../model/ban';
import {PropensityCardComponent} from '../../propensity/propensity-card/propensity-card.component';
import {BasePage} from '../../base/base-page';
import {ApplicationFormComponent} from "../../application/application-form/application-form.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {SearchFilterComponent} from "../../search-filter/search-filter.component";
import {NzModalService} from 'ng-zorro-antd/modal';
import {BanFormComponent} from '../ban-form/ban-form.component';
import {BanService} from '../../ban.service';


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
  providers: [NzModalService, {provide: LOCALE_ID, useValue: 'ru'}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './ban-page.component.html',
  styleUrl: './ban-page.component.css'
})
export class BanPageComponent extends BasePage<Ban> implements OnInit {

  override action = "ban"

  banService: BanService = inject(BanService)

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override preparing(item: Ban): any {
    return new Ban(item).toBackendJson();
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.banService.getBans(
      {
        page: this.page,
        filter: this.searchQuery,
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Ban.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationService.error('Держите меня, я падаю…', 'не удалось загрузить данные');
        }
      });
  }


}
