import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ApplicationForTreatment} from '../../application-for-treatment';
import {GeneralStatus} from '../../enums';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NgForOf, NgIf} from '@angular/common';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzInputGroupComponent,
    NzModalComponent,
    NzRowDirective,
    ReactiveFormsModule,
    NgIf,
    NzSelectComponent,
    NzOptionComponent,
    NgForOf
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css'
})
export class ApplicationFormComponent extends BaseForm<ApplicationForTreatment> implements OnChanges {
  @Input() declare item: ApplicationForTreatment | null;
  @Output() override onSave = new EventEmitter<any>();
  @Output() override onCancel = new EventEmitter<void>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;


  override validateForm: FormGroup<{
    postId: FormControl<string>;
    commentId: FormControl<string>;
    status: FormControl<string>;
    propensityId: FormControl<string>;
  }>;

  statusiki = Object.values(GeneralStatus);

  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      postId: ['', [Validators.pattern('\\d+')]],
      commentId: ['', [Validators.pattern('\\d+')]],
      status: [GeneralStatus.new.toString(), [Validators.required]],
      propensityId: ['', [Validators.required, Validators.pattern('\\d+')]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        postId: this.item.postId?.toString() || '',
        commentId: this.item.commentId?.toString() || '',
        status: this.item.status?.toString() || '',
        propensityId: this.item.propensityId?.toString() || '',
      });
    } else {
      this.validateForm.patchValue({
        postId: '',
        commentId: '',
        status: GeneralStatus.new.toString(),
        propensityId: '',
      });
    }
  }

  formIsValid() {
    return this.validateForm.valid &&
      ((this.validateForm.value.postId === '' && this.validateForm.value.commentId !== '') ||
        (this.validateForm.value.postId !== '' && this.validateForm.value.commentId === ''));
  }


}
