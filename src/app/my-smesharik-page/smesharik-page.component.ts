import {Component, inject} from '@angular/core';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Roles, Smesharik} from '../auth-tools/smesharik';
import {NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {UserService} from '../user.service';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {RoleTagComponent} from '../role-tag/role-tag.component';

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
export class SmesharikPageComponent {
  private userService = inject(UserService);
  isEditing: boolean = false;
  isFormChanged: boolean = false;

  smesharik: Smesharik = {
    name: "lolik",
    login: "lupa",
    password: "*****",
    email: "smesharik@gmail.com",
    role: Roles.doctor,
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
    this.validateForm.disable()
    this.validateForm.valueChanges.subscribe(() => {
      this.isFormChanged = this.validateForm.dirty; // Устанавливаем true, если форма изменилась
    });
  }
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.validateForm.disable()
    }else {
      this.validateForm.enable()
    }
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
  saveIsAvailable(){

    return !this.validateForm.valid || !this.isFormChanged || !this.formIsChanged();
  }

  protected readonly Roles = Roles;
}
