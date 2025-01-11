import { Component } from '@angular/core';
import {ComplaintComponent} from '../complaint/complaint.component';
import {NgForOf, NgIf} from '@angular/common';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {FormsModule} from '@angular/forms';
import {BanComponent} from '../ban/ban.component';
import {Ban} from '../ban';

@Component({
  selector: 'app-ban-page',
  standalone: true,
  imports: [
    ComplaintComponent,
    NgForOf,
    NgIf,
    NzSwitchComponent,
    FormsModule,
    BanComponent
  ],
  templateUrl: './ban-page.component.html',
  styleUrl: './ban-page.component.css'
})
export class BanPageComponent {
  isMyBans=false;

  bans:Ban[]=[
    new Ban(1,"fofoofofof", 1,101,3,'2025-01-10','2025-01-11')
  ]

  onToggleChange(){
    //todo
    console.log(this.isMyBans ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }

}
