import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../model/enums';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NzInputDirective,
    NgClass,
    NzButtonComponent,
    NgIf
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent<T extends Record<string, string | number>> {
  @Input() isStatusesNeeded = true;
  @Input() isSearchNeeded = true;
  @Input() enumType!: T;

  statuses: [string, T[keyof T]][] = [];

  selectedStatuses: T[keyof T][] = [];
  searchQuery: string = '';

  @Output() searchChanged = new EventEmitter<{
    query: string;
    statuses: T[keyof T][];
  }>();

  ngOnInit() {
    if (this.enumType) {
      this.statuses = Object.entries(this.enumType) as [string, T[keyof T]][];
    }
  }


  onFilterChange() {
    this.searchChanged.emit({
      query: this.searchQuery,
      statuses: this.selectedStatuses,
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedStatuses = [];
    this.onFilterChange();
  }

  toggleStatus(status: T[keyof T]) {
    const index = this.selectedStatuses.indexOf(status);
    if (index === -1) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses.splice(index, 1);
    }
    this.onFilterChange();
  }

  getStatus(s: string): T[keyof T] {
    return this.enumType[s as keyof T];
  }
}
