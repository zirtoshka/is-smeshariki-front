import {Component, inject, OnInit} from '@angular/core';
import {BasePage} from '../../base/base-page';
import {Word} from '../../model/triggerword';
import {WordFacade} from '../../facade/word.facade';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {WordFormComponent} from '../word-form/word-form.component';
import {WordCardComponent} from '../word-card/word-card.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-word-page',
  standalone: true,
  imports: [
    NgForOf,
    NzButtonComponent,
    SearchFilterComponent,
    WordFormComponent,
    WordCardComponent,
    NgIf
  ],
  providers:[NzModalService],
  templateUrl: './word-page.component.html',
  styleUrl: './word-page.component.css'
})
export class WordPageComponent  extends BasePage<Word> implements OnInit{
  override action = "word"

  wordFacade: WordFacade = inject(WordFacade)

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override preparing(item: Word): any {
    return new Word(item).toBackendJson();
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.wordFacade.getWords(
      {
        page: this.page,
        filter: this.searchQuery,
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Word.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          this.notificationService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }

  trackById(index: number, item: Word) {
    return item.id;
  }
}
