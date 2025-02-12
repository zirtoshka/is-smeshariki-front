import {Component, inject, OnInit} from '@angular/core';
import {BasePage} from '../../base/base-page';
import {Word} from '../../model/triggerword';
import {WordService} from '../../services/word.service';
import {BanCardComponent} from '../../ban/ban-card/ban-card.component';
import {BanFormComponent} from '../../ban/ban-form/ban-form.component';
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
    BanCardComponent,
    BanFormComponent,
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

  wordService: WordService = inject(WordService)

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override preparing(item: Word): any {
    return new Word(item).toBackendJson();
  }


  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.wordService.getWords(
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
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }
}
