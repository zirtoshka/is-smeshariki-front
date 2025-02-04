import {Component, EventEmitter, Input, LOCALE_ID, OnChanges, Output} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {Ban} from '../../ban';
import {
  FormControl,
  FormGroup,
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
    NzAutosizeDirective
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

  timeDefaultValue = new Date();

  override validateForm: FormGroup<{
    reason: FormControl<string>;
    smesharik: FormControl<string>;
    post: FormControl<string>;
    comment: FormControl<string>;
    creationDate: FormControl<string>;
    endDate: FormControl<string>;
  }>;


  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      reason: ['', [Validators.required]],
      smesharik: [''],
      post: ['', [Validators.pattern('\\d+')]],
      comment: ['', [Validators.pattern('\\d+')]],
      creationDate: [''],
      endDate: ['']
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        reason: this.item.reason,
        smesharik: this.item.smesharik?.toString() || '',
        post: this.item.post?.toString() || '',
        comment: this.item.comment?.toString() || '',
        creationDate: this.item.creationDate?.toString() || '',
        endDate: this.item.creationDate?.toString() || '',
      });
    } else {
      this.validateForm.patchValue({
        reason: '',
        smesharik: '',
        post: '',
        comment: '',
        creationDate: '',
        endDate: ''
      });
    }
  }

  formIsValid() {
    const { post, comment, smesharik } = this.validateForm.value;

    const isOnlyOneFieldFilled =
      (post !== '' && comment === '' && smesharik === '') ||
      (post === '' && comment !== '' && smesharik === '') ||
      (post === '' && comment === '' && smesharik !== '');

    return this.validateForm.valid && isOnlyOneFieldFilled;
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
