import {Component, Input} from '@angular/core';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {Roles} from '../auth-tools/smesharik';

@Component({
  selector: 'app-role-tag',
  standalone: true,
    imports: [
        NzIconDirective,
        NzTagComponent
    ],
  templateUrl: './role-tag.component.html',
  styleUrl: './role-tag.component.css'
})
export class RoleTagComponent {
  @Input() role!: Roles;

  getRoleColor(role: Roles): string {
    switch (role) {
      case Roles.admin:
        return 'volcano';
      case Roles.user:
        return 'blue';
      case Roles.doctor:
        return 'green';
      default:
        return 'default';
    }
  }

  getRoleIcon(role: Roles): string {
    switch (role) {
      case Roles.admin:
        return 'crown';
      case Roles.user:
        return 'user';
      case Roles.doctor:
        return 'medicine-box';
      default:
        return 'question-circle';
    }
  }
}
