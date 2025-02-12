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
import {LOGIN, setLogin} from '../auth-tools/auth-utils';
import {NzColorPickerComponent} from 'ng-zorro-antd/color-picker';
import {NotificationCustomService} from '../notification-custom.service';

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
    RoleTagComponent,
    NzColorPickerComponent
  ],
  templateUrl: './smesharik-page.component.html',
  styleUrl: './smesharik-page.component.css'
})
export class SmesharikPageComponent implements OnInit {
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
    color: FormControl<string>;
  }>;

  passwordForm!: FormGroup<{
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  protected notificationCustomService = inject(NotificationCustomService);

  constructor(private fb: NonNullableFormBuilder) {
    this.validateForm = this.fb.group({
      login: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.pattern('.+@.+\\..+'), Validators.required]],
      color: ['#6d18ff']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {validators: this.passwordsMatch});

    this.passwordForm.disable();
    this.validateForm.disable();
  }


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
        this.smesharik = Smesharik.fromBackend(data);
        this.initForm();
      },
      error: (err) => {
        this.notificationCustomService.handleErrorAsync(err);
        console.error("Ошибка загрузки данных:", err);
      }
    });
  }

  initForm(): void {
    this.validateForm.patchValue({
      login: this.smesharik.login,
      name: this.smesharik.name,
      email: this.smesharik.email,
      color: this.smesharik.color,
    });

    this.passwordForm.patchValue({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
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
    } else {
      this.validateForm.enable()
    }
  }

  logOut() {
    this.authService.logOut();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const {name, login, email, color} = this.validateForm.value;
      if (name && login && email && login.length > 0) {
        const body = {name, login, email, color};
        this.userService.editSmesharik(this.smesharik.login, body).subscribe({
          next: (data) => {
            this.smesharik = Smesharik.fromBackend(data);
            this.notificationCustomService.handleSuccess(
              "Оба-на!",
              "обновление успешно"
            )

            this.initForm();
            this.isEditing = false;
          },
          error: (err) => {
            console.error("Ошибка загрузки данных:", err);
          }
        });

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

  formIsChanged(): boolean {
    const {name, login, email, color} = this.validateForm.value;
    return (
      name !== this.smesharik.name ||
      login !== this.smesharik.login ||
      email !== this.smesharik.email ||
      color !== this.smesharik.color
    );
  }

  submitPasswordChange(): void {
    if (this.passwordForm.valid && this.passwordForm.value.oldPassword && this.passwordForm.value.newPassword) {
      const {oldPassword, newPassword} = this.passwordForm.value;
      this.userService.changePassword(this.smesharik.login, oldPassword, newPassword).subscribe({
        next: () => {
          this.notificationCustomService.handleSuccess("Радикально!", "пароль успешно изменен")
          this.toggleChangePassword();
        },
        error: (err) => {
          this.notificationCustomService.handleErrorAsync(err)
        }
      });
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!newPassword || !confirmPassword) return null;

    return newPassword.value === confirmPassword.value ? null : {passwordsNotMatching: true};
  }


  saveIsAvailable() {

    return !this.validateForm.valid || !this.isFormChanged || !this.formIsChanged();
  }

  protected readonly Roles = Roles;
}
