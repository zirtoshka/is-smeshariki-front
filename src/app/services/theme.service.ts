import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'smeshariki-theme';
  private readonly isBrowser = typeof window !== 'undefined';
  private readonly matcher = this.isBrowser ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  private readonly themeSubject = new BehaviorSubject<ThemeMode>('light');

  readonly theme$ = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const initialTheme = this.resolveInitialTheme();
    this.themeSubject.next(initialTheme);
    this.applyTheme(initialTheme);

    if (this.matcher) {
      this.matcher.addEventListener('change', event => {
        if (!this.hasStoredTheme()) {
          this.setTheme(event.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  toggleTheme(): void {
    this.setTheme(this.themeSubject.value === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode, persist: boolean = true): void {
    if (this.themeSubject.value === theme) {
      return;
    }
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    if (persist) {
      this.persist(theme);
    }
  }

  private resolveInitialTheme(): ThemeMode {
    const stored = this.getStoredTheme();
    if (stored) {
      return stored;
    }
    return this.matcher?.matches ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document.body.setAttribute('data-theme', theme);
  }

  private persist(theme: ThemeMode): void {
    if (!this.storageAvailable()) {
      return;
    }
    localStorage.setItem(this.storageKey, theme);
  }

  private getStoredTheme(): ThemeMode | null {
    if (!this.storageAvailable()) {
      return null;
    }
    const stored = localStorage.getItem(this.storageKey);
    return stored === 'dark' || stored === 'light' ? stored : null;
  }

  private hasStoredTheme(): boolean {
    if (!this.storageAvailable()) {
      return false;
    }
    return localStorage.getItem(this.storageKey) !== null;
  }

  private storageAvailable(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    try {
      const testKey = '__theme__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
