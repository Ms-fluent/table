import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsTableRowContext, MsTableRowDef} from './table-row-def';


let _rowUniqueId = 0;



@Component({
  selector: '[ms-tableRow], [MsTableRow], ms-tableRow',
  exportAs: 'msTableRow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <ng-content ></ng-content>
  `,
  host: {
    'class': 'ms-tableRow',
    'role': 'row',
    '[attr.data-unique-id]': 'id',
    '[attr.aria-rowindex]': 'rowIndex',
    '[attr.aria-selected]': 'selected',
    '[attr.disabled]': 'disabled'
  }
})
export class MsTableRow<T> implements AfterViewInit  {
  get id(): string {
    return this._uniqueId;
  }

  public _uniqueId = `ms-tableRow-${_rowUniqueId++}`;

  get rowIndex(): number {
    return this.context ? this.context.index : undefined;
  }

  @Input()
  disabled: boolean = false;

  @Input()
  get selected(): boolean {
    return this._selected;
  }

  private _selected: boolean;

  get value(): T {
    return this.context ? this.context.$implicit : undefined;
  }

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef;

  coord: DOMRect;

  constructor(private _rowDef: MsTableRowDef<T>,
              private elementRef: ElementRef<HTMLElement>,
              public context: MsTableRowContext<T>) {
  }

  ngAfterViewInit(): void {
    this.container.clear();
    const viewRef = this.container.createEmbeddedView(this._rowDef.template, this.context);
    viewRef.detectChanges();
    setTimeout(() => {
      this.coord = this.host.getBoundingClientRect();
    }, 50);
  }


  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}


