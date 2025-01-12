import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {BaseForm} from '../../base/base-form';
import {Propensity} from '../../propensity';

@Component({
  selector: 'app-propensity-form',
  standalone: true,
  imports: [
    NzCardComponent,
    ReactiveFormsModule,
    NzRowDirective,
    NzColDirective,
    NzInputDirective,
    NgIf,
    NzButtonComponent,
    NzFormModule,
    NzModalComponent,
    NzIconDirective,
    NzInputGroupComponent,
  ],
  providers: [NzModalService],
  templateUrl: './propensity-form.component.html',
  styleUrl: './propensity-form.component.css'
})
export class PropensityFormComponent extends BaseForm<Propensity> implements OnChanges {
  @Input() declare item: Propensity|null;

  @Output() override onSave = new EventEmitter<any>();
  @Output() override onCancel = new EventEmitter<void>();

  @Input()override isEditMode: boolean = false;
  @Input()override isVisible: boolean = false;

  override validateForm: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        name: this.item.name || '',
        description: this.item.description || '',
      });
    } else {
      this.validateForm.patchValue({
        name: '',
        description: '',
      });
    }
  }




}
