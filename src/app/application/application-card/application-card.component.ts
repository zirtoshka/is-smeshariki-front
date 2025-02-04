import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ApplicationForTreatment} from '../../application-for-treatment';
import {Propensity} from '../../model/propensity';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../../model/enums';
import {CommentComponent} from '../../comment/comment.component';
import {PostCardComponent} from '../../post-card/post-card.component';
import {ContentBase} from '../../content-base';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzButtonComponent,
    NzCardComponent,
    NzCardMetaComponent,
    NzOptionComponent,
    NzSelectComponent,
    FormsModule,
    CommentComponent,
    PostCardComponent,
    NzIconDirective
  ],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent extends ContentBase<ApplicationForTreatment> {

  @Input() declare item: ApplicationForTreatment;
  @Input() currDoctorId: number | undefined;

  @Output() override edit = new EventEmitter<ApplicationForTreatment>();
  @Output() override delete = new EventEmitter<ApplicationForTreatment>();


  @Input() propensity!: Propensity;
  generalStatuses = Object.values(GeneralStatus);

  constructor(private router: Router) {
    super();
  }

  onStatusChange(newStatus: GeneralStatus): void {
    this.item.status = newStatus;
  }

  confirmStatus(): void {
    console.log(`Подтверждение статуса: ${this.item.status} для заявки ${this.item.id}`);
    // this.doctorService.updateApplicationStatus(applicationId, application-card.status).subscribe();
  }


  canBeEdit() {
    return this.item.doctorId == undefined || this.item.doctorId == this.currDoctorId;
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post-card', postId]);
  }
  navigateToComment(commentId: number): void {
    this.router.navigate(['/comment', commentId]);

  }
}
