import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {PostComponent} from "../post/post.component";
import {Complaint} from '../complaint';
import {FormsModule} from '@angular/forms';
import {Post} from '../post';
import {GeneralStatus} from '../enums';
import {CommentComponent} from '../comment/comment.component';
import {CommentS} from '../comment';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzButtonComponent,
    NzCardComponent,
    NzCardMetaComponent,
    NzOptionComponent,
    NzSelectComponent,
    NzSwitchComponent,
    PostComponent,
    FormsModule,
    CommentComponent
  ],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent {
  @Input() complaint!: Complaint;
  generalStatuses = Object.values(GeneralStatus);


  selectedPost: Post | null = null;
  selectedComment: CommentS | null = null;


  posts: Post[] = [
    new Post(101, 42, false, false, 'Текст поста 1', '', '2023-01-01T12:00:00Z', '2023-01-01T10:00:00Z'),
    new Post(2, 43, false, true, 'Текст поста 2', '', '2023-02-01T12:00:00Z', '2023-02-01T10:00:00Z'),
  ];

  comments :CommentS[]=[
    new CommentS(1, "sdsdfs", 1,2,null,'2023-02-01T12:00:00Z'),
    new CommentS(3, "sdsdfs", 1,2,1,'2023-02-01T12:00:00Z'),

  ]

  onStatusChange(newStatus: GeneralStatus): void {
    this.complaint.status = newStatus;
  }

  showPost(postId: number): void {
    this.selectedPost = this.posts.find(post => post.id === postId) || null;
  }
  showComment(commentId: number): void {
    this.selectedComment = this.comments.find(comment => comment.id === commentId)||null;
  }

  closePost(): void {
    this.selectedPost = null;
  }
  closeComment(): void {
    this.selectedComment = null;
  }

  confirmComplaintStatus(): void {
    console.log(`Подтверждение статуса: ${this.complaint.status} для жалобы ${this.complaint.id}`);
    //todo
    // this.someService.updateComplaintStatus(complaintId, complaint.status).subscribe();
  }


  assignAdminToComplaint(event: any): void {
    let adminId = event.emit("adminId")
    console.log(`Администратор c id ${adminId} назначен на жалобу №${this.complaint.id}`);
    //todo
    // this.someService.assignAdmin(complaintId, 999).subscribe();
  }

}
