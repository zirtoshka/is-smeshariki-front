import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NgIf
  ],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {
  @Input() isFeed: boolean = false;
  @Output() goBackEvent: EventEmitter<void> = new EventEmitter();

  goBack(): void {
    this.goBackEvent.emit();
  }
}
