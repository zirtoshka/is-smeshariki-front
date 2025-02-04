import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ApplicationForTreatment} from '../../model/application-for-treatment';
import {Propensity} from '../../model/propensity';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../../model/enums';
import {CommentComponent} from '../../comment/comment.component';
import {PostCardComponent} from '../../post-card/post-card.component';
import {ContentBase} from '../../content-base';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Router} from '@angular/router';
import {Complaint} from '../../model/complaint';
import {getLogin} from '../../auth-tools/auth-utils';

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
export class ApplicationCardComponent extends ContentBase<ApplicationForTreatment> implements OnInit  {

  @Input() declare item: ApplicationForTreatment;

  @Output() override edit = new EventEmitter<ApplicationForTreatment>();
  @Output() override delete = new EventEmitter<ApplicationForTreatment>();
  @Output() override takeIt = new EventEmitter<ApplicationForTreatment>();

  @Output() statusConfirmed = new EventEmitter<{ item: ApplicationForTreatment; status: GeneralStatus }>();



  generalStatuses = Object.values(GeneralStatus);
  selectedStatus!: GeneralStatus;

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.selectedStatus = this.item.status;
  }


  confirmComplaintStatus(): void {
    this.statusConfirmed.emit({item: this.item, status: this.selectedStatus});
  }

  assignDoctorToApplication(): void {
    this.takeIt.emit(this.item);
  }





  //todo
  navigateToPost(postId: number): void {
    this.router.navigate(['/post-card', postId]);
  }
  //todo
  navigateToComment(commentId: number): void {
    this.router.navigate(['/comment', commentId]);
  }

}
