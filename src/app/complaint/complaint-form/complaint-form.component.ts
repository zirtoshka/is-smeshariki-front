import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {Complaint} from '../../model/complaint';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {GeneralStatus, ViolationType} from '../../model/enums';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzAutosizeDirective, NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {
  NzDatePickerComponent,
  NzRangePickerComponent
} from 'ng-zorro-antd/date-picker';


@Component({
  selector: 'app-complaint-form',
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

    NzDatePickerModule,
    NzRangePickerComponent,
    NzDatePickerComponent,
    NgIf,
    NzAutosizeDirective
  ],
  templateUrl: './complaint-form.component.html',
  styleUrl: './complaint-form.component.css'
})
export class ComplaintFormComponent extends BaseForm<Complaint> implements OnChanges {
  @Input() declare item: Complaint | null;
  @Output() override onSave = new EventEmitter<Complaint>();
  @Output() override onEdit = new EventEmitter<Complaint>();


  @Output() override onCancel = new EventEmitter<void>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;

  override validateForm: FormGroup;

  statusiki = Object.values(GeneralStatus);
  violationTypes = Object.values(ViolationType);

  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      violationType: [ViolationType.SPAM.toString(), [Validators.required]],
      description: [''],
      adminLogin: [''],
      post: ['', [Validators.pattern('\\d+')]],
      comment: ['', [Validators.pattern('\\d+')]],
      status: [GeneralStatus.NEW.toString(), [Validators.required]],
      creationDate: [null],
      closingDate: [null],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        violationType: this.item.violationType,
        description: this.item.description,
        adminLogin: this.item.adminLogin?.toString() || '',
        post: this.item.post?.toString() || '',
        comment: this.item.comment?.toString() || '',
        status: this.item.status?.toString() || '',
        creationDate: this.item.creationDate ? new Date(this.item.creationDate) : null,
        closingDate: this.item.closingDate ? new Date(this.item.closingDate) : null,
      });
    } else {
      this.validateForm.patchValue({
        violationType: ViolationType.SPAM.toString(),
        description: '',
        adminLogin: '',
        post: '',
        comment: '',
        status: GeneralStatus.NEW.toString(),
        creationDate: null,
        closingDate: null,
      });
    }
  }


  formIsValid() {
    return this.validateForm.valid &&
      ((this.validateForm.value.post === '' && this.validateForm.value.comment !== '') ||
        (this.validateForm.value.post !== '' && this.validateForm.value.comment === ''));
  }


  timeDefaultValue = new Date();


}
