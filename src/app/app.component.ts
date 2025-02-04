import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {LocaleService} from './locale.service';
import {registerLocaleData} from '@angular/common';
import {NzI18nService, ru_RU} from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    NzMenuModule,

    HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'smeshariki-front';

  constructor(private localeService: LocaleService, private i18n: NzI18nService) {
  }

  ngOnInit() {
    this.localeService.setCustomLocale();
    this.i18n.setLocale(ru_RU);
  }
}
