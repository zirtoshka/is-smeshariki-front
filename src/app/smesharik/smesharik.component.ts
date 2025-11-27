import {Component, inject, Input, OnInit} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {DatePipe, Location, NgIf, NgStyle} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Smesharik} from '../auth-tools/smesharik';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {NotificationService} from '../services/notification.service';
import {BackButtonComponent} from '../back-button/back-button.component';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {DataFormaterService} from '../data-formater.service';
import {RoleTagComponent} from '../role-tag/role-tag.component';
import {AvatarComponent} from '../avatar/avatar.component';

@Component({
  selector: 'app-smesharik',
  standalone: true,
  imports: [
    NzCardComponent,
    NgStyle,
    NzTagComponent,
    BackButtonComponent,
    NgIf,
    NzIconDirective,
    RoleTagComponent,
    AvatarComponent
  ],
  providers: [DatePipe],
  templateUrl: './smesharik.component.html',
  styleUrl: './smesharik.component.css'
})
export class SmesharikComponent implements OnInit {
  @Input() smesharik!: Smesharik;

  isFriend = false; //todo
  @Input() neededBack=true

  protected smesharikService = inject(UserService);
  protected notificationService = inject(NotificationService);

  constructor(private route: ActivatedRoute,
              private location: Location,
              protected dateFormatterService: DataFormaterService,

  ) {
  }

  ngOnInit(): void {
    const login = this.route.snapshot.paramMap.get('id');
    if (login){
      this.smesharikService.getSmesharikByLogin(login)
        .subscribe({
        next: (data) => {
          this.smesharik = Smesharik.fromBackend(data);
        },
        error: (err) => {
          this.notificationService.handleErrorAsync(err);
        }
      });
    }
  }

  toggleFriendStatus() {
    this.isFriend = !this.isFriend;
  }

  getStatus() {
    return this.smesharik.isOnline ? 'в сети' : 'не в сети';
  }


  handleGoBack(): void {
    this.location.back();
  }

  getLighterColor(color: string): string {
    return this.shadeColor(color, 50); // Светлее на 50%
  }

  getDarkerGradient(color: string): string {
    const darker = this.shadeColor(color, -30); // Затемним цвет на 30%
    return `linear-gradient(180deg, ${color}, ${darker})`;
  }

  shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, R + (R * percent) / 100));
    G = Math.min(255, Math.max(0, G + (G * percent) / 100));
    B = Math.min(255, Math.max(0, B + (B * percent) / 100));

    return `rgb(${R}, ${G}, ${B})`;
  }
}
