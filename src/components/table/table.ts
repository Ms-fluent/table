import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  IterableChangeRecord,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsTableRow, MsTableRowContent, MsTableRowContext, MsTableRowDef} from './table-row';
import {MsTableHead, MsTableHeadDef} from './table-head';
import {MsTableCellDef} from './table-cell';
import {MS_TABLE_TOKEN} from './table.interface';

let _uniqueId = 0;

@Component({
  selector: 'ms-table, MsTable',
  exportAs: 'msTable',
  templateUrl: 'table.html',
  styleUrls: ['table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: MS_TABLE_TOKEN, useExisting: MsTable}],
  host: {
    'class': 'ms-table',
    '[attr.role]': 'role',
    '[attr.id]': 'id',
    '[attr.dir]': 'dir',
    '[attr.aria-describedby]': 'ariaDescribedby',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-rowcount]': 'ariaRowCount',
    '[attr.aria-colcount]': 'ariaColCount'
  },
})
export class MsTable<T = any> implements AfterViewInit, OnInit, AfterContentInit, AfterViewChecked {
  public _uniqueId = `ms-table-${_uniqueId++}`;

  /** The unique ID for the table head cell. */
  public id: string = this._uniqueId;

  /** The role of the table. */
  public role: string = 'grid';

  /** Accessible label describing or summarizing the list. */
  @Input() ariaLabel: string;

  /** Refers to the element that serves as the label for the table. */
  @Input() ariaLabelledby: string;

  /** Refers to the element that serves as the caption or description for the table. */
  @Input() ariaDescribedby: string;

  /** The directionality of a table */
  @Input()
  dir: 'RTL' | 'LTR' = 'LTR';

  get ariaRowCount(): number {
    return this._ariaRowCount;
  }

  private _ariaRowCount: number = 0;

  get ariaColCount(): number {
    return this._ariaColCount;
  }

  private _ariaColCount: number = 0;

  @Input()
  get hiddenColumns(): string[] {
    return this._hiddenColumns;
  }

  set hiddenColumns(names: string[]) {
    this.hideColumns(names);
  }

  _hiddenColumns: string[] = [];

  @Input()
  get sortFn(): (a: T, b: T) => number {
    return this._sortFn;
  }

  set sortFn(value: (a: T, b: T) => number) {
    this._sortFn = value;
    this.sort(value);
  }

  private _sortFn: (a: T, b: T) => number = () => 0;

  @Output()
  init: EventEmitter<void> = new EventEmitter<void>();

  @ContentChild(forwardRef(() => MsTableHeadDef))
  tableHeadDef: MsTableHeadDef;

  @ContentChildren(forwardRef(() => MsTableHead), {descendants: true})
  tableHeadRows: QueryList<MsTableHead>;

  get tableHeadRow(): MsTableHead {
    return this.tableHeadRows.length === 0 ? null : this.tableHeadRows.toArray()[0];
  }

  @ContentChild(forwardRef(() => MsTableRowDef))
  tableRowDef: MsTableRowDef<T>;

  @ContentChildren(forwardRef(() => MsTableCellDef), {descendants: true})
  cellDefs: QueryList<MsTableCellDef>;

  @ContentChildren(forwardRef(() => MsTableRowContent), {descendants: true})
  rowContents: QueryList<MsTableRowContent>;


  @ViewChild('tableHead', {read: ViewContainerRef})
  tableHeadContainer: ViewContainerRef;

  @ViewChild('tableBody', {read: ViewContainerRef})
  tableBodyContainer: ViewContainerRef;

  private _data: Array<T> = [];
  private _items: Array<T> = [];
  private _itemViews: Map<any, ComponentRef<MsTableRow<T>>> = new Map<any, ComponentRef<MsTableRow<T>>>();
  private differ: IterableDiffer<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private _differs: IterableDiffers,
              private _elementRef: ElementRef<HTMLElement>,
              private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {

    this.tableBodyContainer.clear();
    this.tableHeadContainer.clear();

    const headViewRef = this.tableHeadContainer.createEmbeddedView(this.tableHeadDef.template);
    headViewRef.detectChanges();

    this._data = this.tableRowDef.data.slice();
    this._items = this._data.slice();
    this.differ = this._differs.find(this._items).create();
    this.applyChanges();
    this.init.emit();

  }

  async applyChanges() {
    const changes = this.differ.diff(this._items);
    if (changes == null) {
      return;
    }
    changes.forEachAddedItem(this.forEachAddedItem);
    changes.forEachRemovedItem(this.forEachRemovedItem);
    changes.forEachMovedItem(this.forEachMovedItem);
    let index = 0;
    for (const ref of this._itemViews.values()) {
      ref.instance.context.setData(index++, this._itemViews.size);
      this.animateItem(ref.instance);
    }
  }

  forEachAddedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._createRowView(record.currentIndex);
    this._itemViews.set(record.trackById, ref);
  };

  forEachRemovedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._itemViews.get(record.trackById);
    if (ref != null) {
      this.tableBodyContainer.remove(this.tableBodyContainer.indexOf(ref.hostView));
      this._itemViews.delete(record.trackById);
    }
  };

  forEachMovedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._itemViews.get(record.trackById);
    if (ref != null) {
      this.tableBodyContainer.move(ref.hostView, record.currentIndex);
    }
  };

  _createRowView(i: number): ComponentRef<MsTableRow<T>> {
    const context = new MsTableRowContext(this._items[i], i, this._items.length);
    const injector: Injector = this._createRowInjector(context);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<MsTableRow<T>>(MsTableRow);
    const result = this.tableBodyContainer.createComponent<MsTableRow<T>>(componentFactory, i, injector);
    result.hostView.detectChanges();
    return result;
  }

  _createRowInjector(context: MsTableRowContext<T>): Injector {
    return {
      get: (token: any, notFoundValue?: any): any => {
        const customTokens = new WeakMap<any, any>([
          [MsTableRowContext, context],
          [MsTableRowDef, this.tableRowDef]]);

        const value = customTokens.get(token);

        if (typeof value !== 'undefined') {
          return value;
        }

        return this.injector.get<any>(token, notFoundValue);
      }
    };
  }

  sort(compareFn?: (a: T, b: T) => number) {
    if (!compareFn) {
      return;
    }
    this._items = this._data.sort(compareFn);
    this.applyChanges();
  }

  filter(value: (x: T) => boolean) {
    if (!value) {
      return;
    }
    this._items = this._data.filter(value);
    this.applyChanges();
  }

  reverse() {
    this._items.reverse();
    this.applyChanges();
  }

  remove(...items: T[]) {
    this._data = this._data.filter(item => items.indexOf(item) < 0);
    this._items = this._items.filter(item => items.indexOf(item) < 0);
    this.applyChanges();
  }

  hideColumn(index: number) {
    const width = this.tableHeadRows.toArray()[0].cellDefs.toArray()[index].element.offsetWidth;
    this.tableHeadRows.toArray()[0].destroyCellAt(index);
    this.rowContents.forEach(row => row.destroyCellAt(index));
  }

  showColumn(index: number) {
    const headerCell = this.tableHeadRow.cellDefs.toArray()[index];
    headerCell.create();
    const width = headerCell.element.offsetWidth;
    headerCell.destroy();
    this.tableHeadRows.toArray()[0].createCellAt(index, width);
    this.rowContents.forEach(row => row.createCellAt(index, width));
  }

  toggleColumn(index: number) {
    const headerCell = this.tableHeadRow.cellDefs.toArray()[index];
    if (headerCell.visible) {
      this.hideColumn(index);
    } else {
      this.showColumn(index);
    }
  }

  hideColumns(columnNames: string[]) {
  }

  animateItem(item: MsTableRow<T>): Promise<void> {
    return new Promise<void>(resolve => {
      if (!item.coord) {
        resolve();
        return;
      }
      const y = item.coord.y - item.host.getBoundingClientRect().y;
      item.host.animate([
        {'transform': `translateY( ${y}px)`},
        {'transform': `translateY(0)`}
      ], {fill: 'both', duration: 200, easing: 'ease-in-out'})
        .onfinish = () => resolve();
    });
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}

