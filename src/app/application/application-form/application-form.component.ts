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
import {ApplicationForTreatment} from '../../model/application-for-treatment';
import {GeneralStatus} from '../../model/enums';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NgForOf, NgIf} from '@angular/common';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {Complaint} from '../../model/complaint';
import {ModalAccessibilityDirective} from '../../shared/modal-accessibility.directive';

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
    NgForOf,
    ModalAccessibilityDirective
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css'
})
export class ApplicationFormComponent extends BaseForm<ApplicationForTreatment> implements OnChanges {
  @Input() declare item: ApplicationForTreatment | null;
  @Output() override onSave = new EventEmitter<ApplicationForTreatment>();
  @Output() override onEdit = new EventEmitter<ApplicationForTreatment>();

  @Output() override onCancel = new EventEmitter<void>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;

  statusiki = Object.values(GeneralStatus);

  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      post: [{ value: '' }, [Validators.pattern('\\d+')]],
      comment: [{ value: ''}, [Validators.pattern('\\d+')]],
      doctor: ['', ],
      status: [GeneralStatus.NEW.toString(), [Validators.required]],
      propensities: [{ value: '' }],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        post: this.item.post?.toString() || '',
        comment: this.item.comment?.toString() || '',
        doctor: this.item.doctor?.toString() || '',
        status: this.item.status?.toString() || '',
        propensities: this.item.propensities?.toString() || '',
      });
    } else {
      this.validateForm.patchValue({
        post: '',
        commentId: '',
        status: GeneralStatus.NEW.toString(),
        propensities: '',
      });
    }
  }

  formIsValid() {
    return this.validateForm.valid &&
      ((this.validateForm.value.post === '' && this.validateForm.value.comment !== '') ||
        (this.validateForm.value.post !== '' && this.validateForm.value.comment === ''));
  }


}
