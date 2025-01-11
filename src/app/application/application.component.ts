import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ApplicationForTreatment} from '../application-for-treatment';
import {Propensity} from '../propensity';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../enums';
import {CommentComponent} from '../comment/comment.component';
import {PostComponent} from '../post/post.component';
import {ContentBase} from '../content-base';

@Component({
  selector: 'app-application',
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
    PostComponent
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent extends ContentBase{
  @Input() application!: ApplicationForTreatment;
  @Input() propensity!: Propensity;
  generalStatuses = Object.values(GeneralStatus);

  onStatusChange( newStatus: GeneralStatus): void {
      this.application.status = newStatus;
  }

  confirmStatus(): void {
      console.log(`Подтверждение статуса: ${this.application.status} для заявки ${this.application.id}`);
      // this.doctorService.updateApplicationStatus(applicationId, application.status).subscribe();
    }

}
