import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() public clickOutside = new EventEmitter();
  constructor(private element: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (targetElement.id === 'search') {
      return;
    }
    const isClickedInside = this.element.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.clickOutside.emit(null);
    }
  }
}
