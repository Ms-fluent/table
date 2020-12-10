import {ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation} from '@angular/core';

@Component({
  selector: '[ms-tableCell], [msTableCell], ms-tableCell, msTableCell',
  exportAs: 'msTableCell',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <ng-content></ng-content>`,
  host: {
    'class': 'ms-tableCell',
    'role': 'gridcell'
  }
})
export class MsTableCell {

  constructor( private _elementRef: ElementRef<HTMLElement>) { }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
