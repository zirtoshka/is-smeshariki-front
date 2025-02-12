import {Component, Input, OnInit} from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {Roles, Smesharik} from '../auth-tools/smesharik';
import {NgClass} from '@angular/common';
import {Friend} from '../model/friend';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    NzAvatarComponent,
    NgClass
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent implements OnInit {
  @Input() data!: any;
  smesharik!: Friend;


  ngOnInit() {
    if (this.data) {
      this.smesharik = new Friend(this.data);
    }
  }
}
