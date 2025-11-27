import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, LOCALE_ID, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BanCardComponent} from '../ban-card/ban-card.component';
import {Ban} from '../../model/ban';
import {BasePage} from '../../base/base-page';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {SearchFilterComponent} from "../../search-filter/search-filter.component";
import {NzModalService} from 'ng-zorro-antd/modal';
import {BanFormComponent} from '../ban-form/ban-form.component';
import {BanFacade} from '../../facade/ban.facade';


@Component({
  selector: 'app-ban-card-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    BanCardComponent,
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

  banFacade: BanFacade = inject(BanFacade)

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override preparing(item: Ban): any {
    return new Ban(item).toBackendJson();
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.banFacade.getBans(
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
          this.notificationService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }
}
