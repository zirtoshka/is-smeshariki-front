import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base-page';
import {Complaint} from '../../model/complaint';
import {Ban} from '../../model/ban';
import {Word} from '../../model/triggerword';

@Component({
  selector: 'app-word-page',
  standalone: true,
  imports: [],
  templateUrl: './word-page.component.html',
  styleUrl: './word-page.component.css'
})
export class WordPageComponent  extends BasePage<Word> implements OnInit{
  ngOnInit(): void {
  }

}
