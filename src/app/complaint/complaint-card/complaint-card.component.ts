import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {PostCardComponent} from "../../post-card/post-card.component";
import {Complaint} from '../../complaint';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../../enums';
import {CommentComponent} from '../../comment/comment.component';
import {ContentBase} from '../../content-base';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {DataFormaterService} from '../../data-formater.service';

@Component({
  selector: 'app-complaint-card',
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
    PostCardComponent,
    FormsModule,
    CommentComponent,
    NzIconDirective
  ],
  templateUrl: './complaint-card.component.html',
  styleUrl: './complaint-card.component.css'
})
export class ComplaintCardComponent extends ContentBase<Complaint> implements OnInit {
  @Input() declare item: Complaint;
  @Output() override edit = new EventEmitter<Complaint>();
  @Output() override delete = new EventEmitter<Complaint>();
  @Output() override takeIt = new EventEmitter<Complaint>();

  @Output() statusConfirmed = new EventEmitter<{ item: Complaint; status: GeneralStatus }>();

  constructor(protected dateFormatterService: DataFormaterService) {
    super();
  }

  generalStatuses = Object.values(GeneralStatus);
  selectedStatus!: GeneralStatus;

  ngOnInit() {
    this.selectedStatus = this.item.status;
  }


  confirmComplaintStatus(): void {
    this.statusConfirmed.emit({item: this.item, status: this.selectedStatus});
  }


  assignAdminToComplaint(): void {
    this.takeIt.emit(this.item);
  }

  protected readonly GeneralStatus = GeneralStatus;
}
