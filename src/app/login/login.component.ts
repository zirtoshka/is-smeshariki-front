import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule
} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {AuthService} from '../auth-tools/auth.service';
import {NzIconDirective, NzIconModule} from 'ng-zorro-antd/icon';
import {RouterLink} from '@angular/router';
import {NzColDirective} from 'ng-zorro-antd/grid';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormDirective,
    ReactiveFormsModule,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzFormItemComponent,
    NzButtonComponent,
    NzInputDirective,
    RouterLink,
    NzIconDirective,
    NzColDirective,
    NzFormLabelComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private userService = inject(AuthService)
  passwordVisible = false;


  validateForm: FormGroup<{
    login: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {
    this.validateForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    const {login, password} = this.validateForm.value;
    if (login && password) {
      this.userService.logIn(login, password)
    }else{
      console.log("kkokok")
      // this.userService.makeToast("daad");
    }
    console.log('submit', this.validateForm.value);
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


}
