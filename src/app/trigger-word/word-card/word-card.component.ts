import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {PostCardComponent} from '../../post-card/post-card.component';
import {ContentBase} from '../../content-base';
import {Word} from '../../model/triggerword';


@Component({
  selector: 'app-word-card',
  standalone: true,
  imports: [
    NgIf,
    NzButtonComponent,
    NzCardComponent,
    NzIconDirective,
    PostCardComponent
  ],
  templateUrl: './word-card.component.html',
  styleUrl: './word-card.component.css'
})
export class WordCardComponent extends ContentBase<Word> {
  @Input() declare item: Word;
  @Output() override edit = new EventEmitter<Word>();
  @Output() override delete = new EventEmitter<Word>();

}
