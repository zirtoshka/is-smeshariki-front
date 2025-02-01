import {Component, inject, OnInit} from '@angular/core';
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
  ReactiveFormsModule, ValidationErrors,
  Validators
} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {UserService} from '../services/user.service';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {RoleTagComponent} from '../role-tag/role-tag.component';
import {AuthService} from '../auth-tools/auth.service';
import {LOGIN} from '../auth-tools/auth-utils';

@Component({
  selector: 'app-my-smesharik-page',
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
    RouterLink,
    NzTagComponent,
    RoleTagComponent
  ],
  templateUrl: './smesharik-page.component.html',
  styleUrl: './smesharik-page.component.css'
})
export class SmesharikPageComponent implements OnInit{
  private userService = inject(UserService);
  private authService = inject(AuthService);

  isEditing: boolean = false;
  isFormChanged: boolean = false;
  isChangingPassword: boolean = false;

  smesharik!: Smesharik;

  validateForm!: FormGroup<{
    name: FormControl<string>;
    login: FormControl<string>;
    email: FormControl<string>;
  }>;

  passwordForm!: FormGroup<{
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;



  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    const login = this.getLogin();
    if (login) {
      this.loadSmesharik(login);
    }
  }

  getLogin(): string | null {
    return sessionStorage.getItem(LOGIN);
  }

  loadSmesharik(login: string): void {
    this.userService.getSmesharikByLogin(login).subscribe({
      next: (data) => {
        this.smesharik = data;
        this.initForm();
      },
      error: (err) => {
        console.error("Ошибка загрузки данных:", err);
      }
    });
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      login: [this.smesharik.login, [Validators.required]],
      name: [this.smesharik.name, [Validators.required]],
      email: [this.smesharik.email, [Validators.pattern('.+@.+\\..+'), Validators.required]],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });

    this.passwordForm.disable();
    this.validateForm.disable();
    this.validateForm.valueChanges.subscribe(() => {
      this.isFormChanged = this.validateForm.dirty;
    });
  }
  passwordVisible = {
    old: false,
    new: false,
    confirm: false
  };

  togglePasswordVisibility(field: 'old' | 'new' | 'confirm'): void {
    this.passwordVisible[field] = !this.passwordVisible[field];
  }

  toggleChangePassword(): void {
    this.isChangingPassword = !this.isChangingPassword;
    if (this.isChangingPassword) {
      this.passwordForm.enable();
    } else {
      this.passwordForm.reset();
      this.passwordForm.disable();
    }
  }
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.validateForm.disable()
    }else {
      this.validateForm.enable()
    }
  }

  logOut(){
    this.authService.logOut();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const {name, login,email} = this.validateForm.value;
      if (name && login && email && login.length > 0) {
        this.userService.editSmesharik(name,login,email);
      }
      this.isFormChanged = false;

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  formIsChanged(): boolean {
    const { name, login, email } = this.validateForm.value;
    return (
      name !== this.smesharik.name ||
      login !== this.smesharik.login ||
      email !== this.smesharik.email
    );
  }

  submitPasswordChange(): void {
    if (this.passwordForm.valid &&  this.passwordForm.value.oldPassword &&  this.passwordForm.value.newPassword) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(this.smesharik.login, oldPassword, newPassword).subscribe({
        next: () => {
          console.log("Пароль успешно изменен");
          this.toggleChangePassword();
        },
        error: (err) => {
          console.error("Ошибка смены пароля:", err);
        }
      });
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!newPassword || !confirmPassword) return null;

    return newPassword.value === confirmPassword.value ? null : { passwordsNotMatching: true };
  }


  saveIsAvailable(){

    return !this.validateForm.valid || !this.isFormChanged || !this.formIsChanged();
  }

  protected readonly Roles = Roles;
}
