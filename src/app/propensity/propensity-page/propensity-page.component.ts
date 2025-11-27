import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {Propensity} from '../../model/propensity';
import {BasePage} from '../../base/base-page';
import {PropensityCardComponent} from '../propensity-card/propensity-card.component';
import {PropensityFormComponent} from '../propensity-form/propensity-form.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzModalService} from 'ng-zorro-antd/modal';
import {PropensityFacade} from '../../facade/propensity.facade';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';

@Component({
  imports: [
    NgForOf,
    NgIf,
    CommonModule,
    PropensityCardComponent,
    PropensityFormComponent,
    NzButtonComponent,
    SearchFilterComponent,
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

  propensityFacade: PropensityFacade = inject(PropensityFacade);

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override preparing(item: Propensity): any {
    return new Propensity(item).toBackendJson();
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.propensityFacade.getPropensities(
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
          this.notificationService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }
}
