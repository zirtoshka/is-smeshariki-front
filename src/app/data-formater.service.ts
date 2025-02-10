import { Injectable } from '@angular/core';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DataFormaterService {

  constructor(private datePipe: DatePipe) {}

  formatDate(date: Date | null|undefined, format: string = 'dd MMMM yyyy HH:mm:ss', locale: string = 'ru-RU'): string {
    if (!date) return '';
    return this.datePipe.transform(date, format, undefined, locale) || '';
  }}
