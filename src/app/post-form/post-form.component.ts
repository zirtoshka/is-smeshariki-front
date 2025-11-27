import {Component, inject} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {PostService} from '../services/post.service';
import {NotificationService} from '../services/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-card-form',
  standalone: true,
  imports: [
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
  providers: [PostService],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent {
  postForm: FormGroup;
  imageFile: File | null = null;

  postService = inject(PostService);
  protected notificationService = inject(NotificationService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.postForm = this.fb.group({
      text: ['', []],
      visibility: ['public', Validators.required], // public, private, draft
    });
  }

  checkSubmit() {
    return this.postForm.value.text != "" || this.imageFile != null;
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
    const visibility = this.postForm.get('visibility')?.value;
    formData.append('isPrivate', (visibility === 'private' || visibility === 'draft').toString());
    formData.append('isDraft', (visibility === 'draft').toString());

    if (this.imageFile) {
      formData.append('imageFile', this.imageFile);
    }

    this.postService.createPost(formData)
      .then(r => {
        this.resetForm()
        this.navigateToPost(r.id)
      })
      .catch(error => {
        this.notificationService.handleErrorAsync(error, 'Держите меня, я падаю…');
      });
  }

  resetForm() {
    this.postForm.patchValue({
      text: '',
      visibility: 'public',
    });
    this.imageFile = null;
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post-card', postId]);
  }
}
