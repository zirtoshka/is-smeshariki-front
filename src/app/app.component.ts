import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {LocaleService} from './locale.service';

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

  constructor(private localeService: LocaleService) {}

  ngOnInit() {
    this.localeService.setCustomLocale();
  }
}
