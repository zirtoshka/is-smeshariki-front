import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ApplicationForTreatment} from '../../application-for-treatment';
import {Propensity} from '../../propensity';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../../enums';
import {CommentComponent} from '../../comment/comment.component';
import {PostComponent} from '../../post/post.component';
import {ContentBase} from '../../content-base';
import {NzIconDirective} from 'ng-zorro-antd/icon';

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
    PostComponent,
    NzIconDirective
  ],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent extends ContentBase<ApplicationForTreatment>{

  @Input() declare item: ApplicationForTreatment;
  @Output() override edit = new EventEmitter<ApplicationForTreatment>();
  @Output() override delete = new EventEmitter<ApplicationForTreatment>();


  @Input() propensity!: Propensity;
  generalStatuses = Object.values(GeneralStatus);

  onStatusChange( newStatus: GeneralStatus): void {
      this.item.status = newStatus;
  }

  confirmStatus(): void {
      console.log(`Подтверждение статуса: ${this.item.status} для заявки ${this.item.id}`);
      // this.doctorService.updateApplicationStatus(applicationId, application-card.status).subscribe();
    }

}
