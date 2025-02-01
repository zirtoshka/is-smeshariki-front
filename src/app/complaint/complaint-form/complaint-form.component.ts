import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
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
import {NgForOf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {en_US, NzI18nService, ru_RU} from 'ng-zorro-antd/i18n';

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
    ReactiveFormsModule
  ],
  templateUrl: './complaint-form.component.html',
  styleUrl: './complaint-form.component.css'
})
export class ComplaintFormComponent extends BaseForm<Complaint> implements OnChanges {
  @Input() declare item: Complaint | null;
  @Output() override onSave = new EventEmitter<any>();
  @Output() override onCancel = new EventEmitter<void>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;


  override validateForm: FormGroup<{
    violationType: FormControl<string>;
    description: FormControl<string>;
    adminLogin: FormControl<string>;
    postId: FormControl<string>;
    commentId: FormControl<string>;
    status: FormControl<string>;
  }>;


  statusiki = Object.values(GeneralStatus);
  violationTypes = Object.values(ViolationType);

  constructor(private fb: NonNullableFormBuilder, private i18n: NzI18nService) {
    super();
    this.validateForm = this.fb.group({
      violationType: [ViolationType.SPAM.toString(), [Validators.required]],
      description: [''],
      adminLogin: ['', [Validators.pattern('\\d+')]],
      postId: ['', [Validators.pattern('\\d+')]],
      commentId: ['', [Validators.pattern('\\d+')]],
      status: [GeneralStatus.new.toString(), [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        violationType: this.item.violationType,
        description: this.item.description,
        adminLogin: this.item.adminLogin?.toString() || '',
        postId: this.item.postId?.toString() || '',
        commentId: this.item.commentId?.toString() || '',
        status: this.item.status?.toString() || '',
      });
    } else {
      this.validateForm.patchValue({
        violationType: ViolationType.SPAM.toString(),
        description: '',
        adminLogin: '',
        postId: '',
        commentId: '',
        status: GeneralStatus.new.toString(),
      });
    }
  }

  formIsValid() {
    return this.validateForm.valid &&
      ((this.validateForm.value.postId === '' && this.validateForm.value.commentId !== '') ||
        (this.validateForm.value.postId !== '' && this.validateForm.value.commentId === ''));
  }


  changeLanguage(): void {
    // this.i18n.setLocale( en_US);
    this.i18n.setLocale( ru_RU );
  }
}
