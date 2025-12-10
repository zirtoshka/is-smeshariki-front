import {Component, EventEmitter, Input, LOCALE_ID, OnChanges, Output} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {Ban} from '../../model/ban';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzAutosizeDirective, NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {ModalAccessibilityDirective} from '../../shared/modal-accessibility.directive';

@Component({
  selector: 'app-ban-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzInputGroupComponent,
    NzModalComponent,
    NzOptionComponent,
    NzRowDirective,
    NzSelectComponent,
    ReactiveFormsModule,
    NzDatePickerComponent,
    NzAutosizeDirective,
    ModalAccessibilityDirective
  ],
  providers: [{provide: LOCALE_ID, useValue: 'ru'}],
  templateUrl: './ban-form.component.html',
  styleUrl: './ban-form.component.css'
})
export class BanFormComponent extends BaseForm<Ban> implements OnChanges {
  @Input() declare item: Ban | null;
  @Output() override onSave = new EventEmitter<any>();
  @Output() override onCancel = new EventEmitter<void>();

  @Output() override onEdit = new EventEmitter<Ban>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;

  timeDefaultValue = new Date();

  // override validateForm: FormGroup;

  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      reason: ['', [Validators.required]],
      smesharik: [''],
      post: ['', [Validators.pattern('\\d+')]],
      comment: ['', [Validators.pattern('\\d+')]],
      creationDate: [null],
      endDate: [null]
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        reason: this.item.reason,
        smesharik: this.item.smesharik?.toString() || '',
        post: this.item.post?.toString() || '',
        comment: this.item.comment?.toString() || '',
        creationDate: this.item.creationDate ? new Date(this.item.creationDate) : null,
        endDate: this.item.endDate ? new Date(this.item.endDate) : null,

      });
    } else {
      this.validateForm.patchValue({
        reason: '',
        smesharik: '',
        post: '',
        comment: '',
        creationDate: null,
        endDate: null
      });
    }
  }

  formIsValid() {
    const {post, comment, smesharik} = this.validateForm.value;

    const isOnlyOneFieldFilled =
      (post !== '' && comment === '' && smesharik === '') ||
      (post === '' && comment !== '' && smesharik === '') ||
      (post === '' && comment === '' && smesharik !== '');

    return this.validateForm.valid && isOnlyOneFieldFilled;
  }
}
