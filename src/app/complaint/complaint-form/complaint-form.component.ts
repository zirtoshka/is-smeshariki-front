import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {Complaint} from '../../complaint';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {GeneralStatus, ViolationType} from '../../enums';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {en_US, NzI18nService, ru_RU} from 'ng-zorro-antd/i18n';
import {
  DisabledTimeFn, DisabledTimePartial,
  NzDatePickerComponent,
  NzDatePickerModule,
  NzRangePickerComponent
} from 'ng-zorro-antd/date-picker';
import {differenceInCalendarDays, setHours} from 'date-fns';


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
    NgIf
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


  override validateForm: FormGroup<{
    violationType: FormControl<string>;
    description: FormControl<string>;
    adminLogin: FormControl<string>;
    post: FormControl<string>;
    comment: FormControl<string>;
    status: FormControl<string>;
  }>;


  statusiki = Object.values(GeneralStatus);
  violationTypes = Object.values(ViolationType);

  constructor(private fb: NonNullableFormBuilder, private i18n: NzI18nService) {
    super();
    // this.i18n.setLocale( en_US );
    this.setCustomLocale();

    this.validateForm = this.fb.group({
      violationType: [ViolationType.SPAM.toString(), [Validators.required]],
      description: [''],
      adminLogin: [''],
      post: ['', [Validators.pattern('\\d+')]],
      comment: ['', [Validators.pattern('\\d+')]],
      status: [GeneralStatus.NEW.toString(), [Validators.required]],
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
      });
    } else {
      this.validateForm.patchValue({
        violationType: ViolationType.SPAM.toString(),
        description: '',
        adminLogin: '',
        post: '',
        comment: '',
        status: GeneralStatus.NEW.toString(),
      });
    }
  }


  formIsValid() {
    return this.validateForm.valid &&
      ((this.validateForm.value.post === '' && this.validateForm.value.comment !== '') ||
        (this.validateForm.value.post !== '' && this.validateForm.value.comment === ''));
  }


  changeLanguage(): void {
    // this.i18n.setLocale( en_US);
    this.i18n.setLocale(ru_RU);
  }

  timeDefaultValue = setHours(new Date(), 0);


  setCustomLocale() {
    this.i18n.setLocale({
      ...ru_RU,
      DatePicker: {
        ...ru_RU.DatePicker,
        lang: {
          ...ru_RU.DatePicker.lang,
          rangeQuarterPlaceholder: ['Начало квартала', 'Конец квартала'],
        },
      },
    });
  }


  dateRange: Date[] = [];

  onDateChange() {
    if (this.dateRange && this.dateRange.length === 1) {
      // Если выбрана только одна дата, принудительно фиксируем ее
      this.dateRange = [this.dateRange[0], undefined as unknown as Date]; // Хак, но работает
    }
  }

  formatDateRange(range: Date[]): string {
    if (!range || range.length === 0) return 'Дата не выбрана';
    if (range[0] && !range[1]) return `Начало: ${range[0].toLocaleString()}`;
    if (!range[0] && range[1]) return `Конец: ${range[1].toLocaleString()}`;
    return `С: ${range[0].toLocaleString()} по: ${range[1].toLocaleString()}`;
  }


}
