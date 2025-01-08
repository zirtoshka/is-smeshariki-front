import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup, FormsModule,
  NonNullableFormBuilder, ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCheckboxComponent} from 'ng-zorro-antd/checkbox';
import {RouterLink} from '@angular/router';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';
import {AuthService} from '../auth-tools/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzColDirective,
    NzFormItemComponent,
    NzFormDirective,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzInputGroupComponent,
    NzOptionComponent,
    NzSelectComponent,
    NzRowDirective,
    NzButtonComponent,
    NzCheckboxComponent,
    RouterLink,
    FormsModule,
    NzIconDirective,
    NgIf
  ],

  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  private userService = inject(AuthService);

  passwordVisible = false;
  confirmPasswordVisible = false;
  validateForm: FormGroup<{
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    name: FormControl<string>;
    login: FormControl<string>;
    email: FormControl<string>;
  }>;


  constructor(private fb: NonNullableFormBuilder ) {
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      login: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email:['', [Validators.pattern('.+@.+\\..+'), Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }


  submitForm(): void {
    if (this.validateForm.valid) {
      const {name, password, checkPassword} = this.validateForm.value;
      if (name && password && checkPassword === password) {
        this.userService.register(name, password);
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

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.validateForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  };


}
