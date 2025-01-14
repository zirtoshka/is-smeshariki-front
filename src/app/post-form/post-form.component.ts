import {Component} from '@angular/core';
import {PostTagComponent} from '../post-tag/post-tag.component';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-post-card-form',
  standalone: true,
  imports: [
    PostTagComponent,
    NzCardComponent,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzColDirective,
    FormsModule,
    NzFormItemComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzButtonComponent,
    NzFormDirective
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent {
  postForm: FormGroup;
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.postForm = this.fb.group({
      text: ['', []],
      visibility: ['public', Validators.required], // public, private, draft
    });
  }

  checkSubmit() {
    return this.postForm.value.text.emptyText || this.imageFile != null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  submitForm(): void {
    if (this.postForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('text', this.postForm.get('text')!.value);
    formData.append('visibility', this.postForm.get('visibility')!.value);

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    //todo add service
    this.http.post('/api/posts', formData).subscribe({
      next: (response: any) => {
        console.log('Post created successfully:', response);
        this.postForm.reset();
        this.imageFile = null;
      },
      error: (error: any) => {
        console.error('Error creating post:', error);
      },
    });
  }

}
