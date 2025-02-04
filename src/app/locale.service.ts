import {Injectable} from '@angular/core';
import {NzI18nService, ru_RU} from 'ng-zorro-antd/i18n';

@Injectable({
  providedIn: 'root'
})

export class LocaleService {

  constructor(private i18n: NzI18nService) {
  }

  setCustomLocale() {
    this.i18n.setLocale({
      ...ru_RU,
      DatePicker: {
        ...ru_RU.DatePicker,
        lang: {
          ...ru_RU.DatePicker.lang,
          rangeQuarterPlaceholder: ['начало квартала', 'конец квартала'],
          rangePlaceholder: ['начало', 'конец']
        },
      },
    });
  }
}

