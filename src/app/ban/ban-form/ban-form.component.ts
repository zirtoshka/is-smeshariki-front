import {Component, EventEmitter, Input, LOCALE_ID, OnChanges, Output} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {Complaint} from '../../complaint';
import {Ban} from '../../ban';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {GeneralStatus, ViolationType} from '../../enums';
import {NgForOf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';

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
    NzDatePickerComponent
  ],
  providers: [{provide: LOCALE_ID, useValue: 'ru'}],
  templateUrl: './ban-form.component.html',
  styleUrl: './ban-form.component.css'
})
export class BanFormComponent extends BaseForm<Ban> implements OnChanges {
  @Input() declare item: Ban | null;
  @Output() override onSave = new EventEmitter<any>();
  @Output() override onCancel = new EventEmitter<void>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;


  override validateForm: FormGroup<{
    reason: FormControl<string>;
    smesharikId: FormControl<string>;
    postId: FormControl<string>;
    commentId: FormControl<string>;
    creationDate: FormControl<string>;
    endDate: FormControl<string>;
  }>;


  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      reason: ['', [Validators.required]],
      smesharikId: ['', [Validators.pattern('\\d+')]],
      postId: ['', [Validators.pattern('\\d+')]],
      commentId: ['', [Validators.pattern('\\d+')]],
      creationDate: [''],
      endDate: ['']
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        reason: this.item.reason,
        smesharikId: this.item.smesharikId?.toString() || '',
        postId: this.item.postId?.toString() || '',
        commentId: this.item.commentId?.toString() || '',
        creationDate: this.item.creationDate?.toString() || '',
        endDate: this.item.creationDate?.toString() || '',
      });
    } else {
      this.validateForm.patchValue({
        reason: '',
        smesharikId: '',
        postId: '',
        commentId: '',
        creationDate: '',
        endDate: ''
      });
    }
  }

  formIsValid() {
    return this.validateForm.valid &&
      ((this.validateForm.value.postId === '' && this.validateForm.value.commentId !== '') ||
        (this.validateForm.value.postId !== '' && this.validateForm.value.commentId === ''));
  }


  onChange(result: Date): void {
    console.log('Selected Time: ', result);
    const date = new Date();
    console.log(date.toLocaleDateString('ru'));
  }

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }

  onCalendarChange(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
  }
}
