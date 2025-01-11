import { Component } from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf, NgIf} from '@angular/common';
import {Complaint} from '../complaint';
import {GeneralStatus, ViolationType} from '../enums';
import {FormsModule} from '@angular/forms';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {HeaderComponent} from '../header/header.component';
import {PostComponent} from '../post/post.component';
import {Post} from '../post';
import {ComplaintComponent} from '../complaint/complaint.component';

@Component({
  selector: 'app-complaint-page',
  standalone: true,
  imports: [
    NzCardComponent,
    NgForOf,
    NzCardMetaComponent,
    FormsModule,
    NzOptionComponent,
    NzSelectComponent,
    NzButtonComponent,
    NgIf,
    NzSwitchComponent,
    HeaderComponent,
    PostComponent,
    ComplaintComponent
  ],
  templateUrl: './complaint-page.component.html',
  styleUrl: './complaint-page.component.css'
})
export class ComplaintPageComponent {
  isMyComplaints=false;
  complaints: Complaint[] = [
    new Complaint(
      1,
      ViolationType.SPAM,
      'Пост с рекламой товаров',
      null,
      101,
      null,
      GeneralStatus.new,
      '2025-01-10',
      ''
    ),
    new Complaint(
      2,
      ViolationType.eroticContent,
      'Оскорбительный комментарий',
      301,
      null,
      202,
      GeneralStatus.done,
      '2025-01-09',
      '2025-01-10'
    ),
    new Complaint(
      3,
      ViolationType.fraudOrMisleading,
      'Нецензурная лексика в посте',
      null,
      null,
      203,
      GeneralStatus.inProgress,
      '2025-01-08',
      ''
    ),
  ];






  onToggleChange(){
    //todo
    console.log(this.isMyComplaints ? 'Отображаются мои заявки' : 'Отображаются все заявки');
  }




}
