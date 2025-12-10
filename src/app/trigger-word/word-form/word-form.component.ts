import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {BaseForm} from '../../base/base-form';
import {Ban} from '../../model/ban';
import {Word} from '../../model/triggerword';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzAutosizeDirective, NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {ModalAccessibilityDirective} from '../../shared/modal-accessibility.directive';

@Component({
  selector: 'app-word-form',
  standalone: true,
  imports: [
    FormsModule,
    NzAutosizeDirective,
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
    NzButtonComponent,
    ModalAccessibilityDirective
  ],
  templateUrl: './word-form.component.html',
  styleUrl: './word-form.component.css'
})
export class WordFormComponent extends BaseForm<Word> implements OnChanges {
  @Input() declare item: Word | null;
  @Output() override onSave = new EventEmitter<any>();
  @Output() override onCancel = new EventEmitter<void>();

  @Output() override onEdit = new EventEmitter<Word>();

  @Input() override isEditMode: boolean = false;
  @Input() override isVisible: boolean = false;

  constructor(private fb: NonNullableFormBuilder) {
    super();
    this.validateForm = this.fb.group({
      propensity: ['', [Validators.pattern('\\d+'), Validators.required]],
      word: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.validateForm.patchValue({
        propensity: this.item.propensity,
        word: this.item.word
      });
    } else {
      this.validateForm.patchValue({
        word: '',
        propensity: ''
      });
    }
  }


  formIsValid() {
    return this.validateForm.valid;
  }



}
