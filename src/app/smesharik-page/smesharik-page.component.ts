import {Component, inject} from '@angular/core';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Roles, Smesharik} from '../auth-tools/smesharik';
import {NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {AuthService} from '../auth-tools/auth.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-smesharik-page',
  standalone: true,
  imports: [
    NzAvatarComponent,
    NgIf,
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzRowDirective,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './smesharik-page.component.html',
  styleUrl: './smesharik-page.component.css'
})
export class SmesharikPageComponent {
  private userService = inject(UserService);

  smesharik: Smesharik = {
    name: "lolik",
    login: "lupa",
    password: "*****",
    email: "smesharik@gmail.com",
    role: Roles.user,
    isOnline: true,
    lastActive: "string"
  }

  validateForm: FormGroup<{
    name: FormControl<string>;
    login: FormControl<string>;
    email: FormControl<string>;
  }>;


  constructor(private fb: NonNullableFormBuilder) {


    this.validateForm = this.fb.group({
      login: [this.smesharik.login, [Validators.required]],
      name: [this.smesharik.name, [Validators.required]],
      email: [this.smesharik.email, [Validators.pattern('.+@.+\\..+'), Validators.required]],
    });

  }



  submitForm(): void {
    if (this.validateForm.valid) {
      const {name, login,email} = this.validateForm.value;
      if (name && login && email && login.length > 0) {
        this.userService.editSmesharik(name,login,email);
      }

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
