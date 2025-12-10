import {Directive, Inject, OnDestroy, OnInit} from '@angular/core';
import {NzModalComponent} from 'ng-zorro-antd/modal';
import {DOCUMENT} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';

@Directive({
  selector: '[appModalAccessibility]',
  standalone: true
})
export class ModalAccessibilityDirective implements OnInit, OnDestroy {
  private static idCounter = 0;
  private destroy$ = new Subject<void>();
  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private readonly keydownHandler = (event: KeyboardEvent) => this.handleKeydown(event);
  private readonly titleId = ModalAccessibilityDirective.generateId('title');
  private readonly descriptionId = ModalAccessibilityDirective.generateId('description');

  constructor(
    private readonly nzModalComponent: NzModalComponent,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
  }

  ngOnInit(): void {
    this.nzModalComponent.afterOpen.pipe(takeUntil(this.destroy$)).subscribe(() => this.handleModalOpen());
    this.nzModalComponent.afterClose.pipe(takeUntil(this.destroy$)).subscribe(() => this.handleModalClose());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeKeydownListener();
  }

  private static generateId(segment: string): string {
    ModalAccessibilityDirective.idCounter += 1;
    return `app-modal-${segment}-${ModalAccessibilityDirective.idCounter}`;
  }

  private handleModalOpen(): void {
    const modalElement = this.nzModalComponent.getElement();
    if (!modalElement) {
      return;
    }

    this.applyAccessibilityAttributes(modalElement);

    const activeElement = this.document.activeElement as HTMLElement | null;
    if (!modalElement.contains(activeElement)) {
      this.previouslyFocusedElement = activeElement;
    }

    this.focusableElements = this.getFocusableElements(modalElement);

    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus({preventScroll: true});
    } else {
      modalElement.setAttribute('tabindex', '-1');
      modalElement.focus({preventScroll: true});
    }

    modalElement.addEventListener('keydown', this.keydownHandler);
  }

  private handleModalClose(): void {
    this.removeKeydownListener();
    const elementToFocus = this.previouslyFocusedElement;
    this.previouslyFocusedElement = null;
    if (elementToFocus && typeof elementToFocus.focus === 'function') {
      setTimeout(() => elementToFocus.focus());
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.handleEscape(event);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const modalElement = this.nzModalComponent.getElement();
    if (!modalElement) {
      return;
    }

    this.focusableElements = this.getFocusableElements(modalElement);
    if (this.focusableElements.length === 0) {
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    const activeElement = this.document.activeElement as HTMLElement | null;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private removeKeydownListener(): void {
    const modalElement = this.nzModalComponent.getElement();
    if (modalElement) {
      modalElement.removeEventListener('keydown', this.keydownHandler);
    }
    this.focusableElements = [];
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    return Array.from(container.querySelectorAll<HTMLElement>(selectors))
      .filter(element => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
  }

  private applyAccessibilityAttributes(modalElement: HTMLElement): void {
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');

    const titleElement = modalElement.querySelector<HTMLElement>('.ant-modal-title');
    if (titleElement) {
      if (!titleElement.id) {
        titleElement.id = this.titleId;
      }
      modalElement.setAttribute('aria-labelledby', titleElement.id);
    } else {
      modalElement.removeAttribute('aria-labelledby');
    }

    const bodyElement = modalElement.querySelector<HTMLElement>('.ant-modal-body');
    if (bodyElement) {
      if (!bodyElement.id) {
        bodyElement.id = this.descriptionId;
      }
      modalElement.setAttribute('aria-describedby', bodyElement.id);
    } else {
      modalElement.removeAttribute('aria-describedby');
    }
  }

  private handleEscape(event: KeyboardEvent): void {
    if (this.nzModalComponent.nzKeyboard === false) {
      return;
    }
    event.preventDefault();
    this.nzModalComponent.triggerCancel();
  }
}
