import {ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, QueryList, ViewEncapsulation} from '@angular/core';
import {MsTableCell} from './table-cell';


let _rowUniqueId = 0;


@Component({
  selector: '[ms-tableRow], [msTableRow], ms-tableRow, msTableRow',
  exportAs: 'msTableRow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <ng-content></ng-content>
  `,
  host: {
    'class': 'ms-tableRow',
    'role': 'row',
    '[attr.data-unique-id]': 'id',
    // '[attr.aria-rowindex]': 'rowIndex',
    '[attr.aria-selected]': 'selected',
    '[attr.disabled]': 'disabled'
  }
})
export class MsTableRow<T = any> {
  get id(): string {
    return this._uniqueId;
  }

  public _uniqueId = `ms-tableRow-${_rowUniqueId++}`;

  // get rowIndex(): number {
  //   return this.context ? this.context.index : undefined;
  // }

  @Input()
  disabled: boolean = false;

  @Input()
  get selected(): boolean {
    return this._selected;
  }

  private _selected: boolean;

  @Input()
  value: T;

  // get value(): T {
  //   return this.context ? this.context.$implicit : undefined;
  // }

  @ContentChildren(MsTableCell)
  cells: QueryList<MsTableCell>;

  @Input()
  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this.host.style.display = value ? 'table-row' : 'none';
    this._visible = value;
  }

  private _visible: boolean;

  // coord: DOMRect;

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  // ngAfterViewInit(): void {
  //   this.container.clear();
  //   const viewRef = this.container.createEmbeddedView(this._rowDef.template, this.context);
  //   viewRef.detectChanges();
  //   setTimeout(() => {
  //     this.coord = this.host.getBoundingClientRect();
  //   }, 50);
  // }

  hideCell(index: number) {
    const cells = this.cells.toArray();
    if (index < 0 || index > cells.length - 1) {
      throw new Error('Cell index of range');
    }

    cells[index].host.style.display = 'none';
  }

  showCell(index: number) {
    const cells = this.cells.toArray();
    if (index < 0 || index > cells.length - 1) {
      throw new Error('Cell index of range');
    }

    cells[index].host.style.display = 'table-cell';
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}


