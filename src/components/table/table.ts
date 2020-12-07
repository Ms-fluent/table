import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChild,
  ContentChildren,
  ElementRef,
  EmbeddedViewRef,
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
import {MsTableRow} from './table-row';
import {MsTableHead, MsTableHeadDef} from './table-head';
import {MS_TABLE_TOKEN} from './table.interface';
import {MsTableRowContext, MsTableRowDef} from './table-row-def';
import {first} from 'rxjs/operators';

let _uniqueId = 0;

@Component({
  selector: 'ms-table, MsTable',
  exportAs: 'msTable',
  templateUrl: 'table.html',
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
    if (this.tableRows) {
      this.hideColumns(names);
    }
    this._hiddenColumns = names;
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
  tableHeadRows: QueryList<MsTableHead<T>>;

  @ContentChildren(forwardRef(() => MsTableRow), {descendants: true})
  tableRows: QueryList<MsTableRow>;

  get tableHeadRow(): MsTableHead<T> {
    return this.tableHeadRows.length === 0 ? null : this.tableHeadRows.toArray()[0];
  }

  @ContentChild(forwardRef(() => MsTableRowDef))
  tableRowDef: MsTableRowDef<T>;

  @ViewChild('tableHead', {read: ViewContainerRef})
  tableHeadContainer: ViewContainerRef;

  @ViewChild('tableBody', {read: ViewContainerRef})
  tableBodyContainer: ViewContainerRef;


  private _items: Array<T> = [];
  get items(): T[] {
    return this._items.slice();
  }

  private _itemViews: Map<any, EmbeddedViewRef<MsTableRowContext<T>>> = new Map();
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

    this._items = this.tableRowDef.data.slice();
    this.differ = this._differs.find(this._items).create();
    this.applyChanges();

    this.tableRows.changes.pipe(first()).subscribe(() => {
      this.hideColumns(this.hiddenColumns);
    });
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

    changes.forEachItem(record => {
     const ref = this._itemViews.get(record.trackById);
     ref.context.setData(record.currentIndex, this._itemViews.size);
     this.animateItem(ref);
    });
  }

  forEachAddedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._createRowView(record.currentIndex);
    this._itemViews.set(record.trackById, ref);
  };

  forEachRemovedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._itemViews.get(record.trackById);
    if (ref != null) {
      this.tableBodyContainer.remove(this.tableBodyContainer.indexOf(ref));
      this._itemViews.delete(record.trackById);
    }
  };

  forEachMovedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._itemViews.get(record.trackById);
    if (ref != null) {
      this.tableBodyContainer.move(ref, record.currentIndex);
      ref.context.index = record.currentIndex;
    }
  };

  _createRowView(i: number): EmbeddedViewRef<MsTableRowContext<T>> {
    const context = new MsTableRowContext(this._items[i], i, this._items.length);
    const viewRef = this.tableBodyContainer.createEmbeddedView(this.tableRowDef.template, context, i);
    viewRef.detectChanges();

    setTimeout(() => {
      viewRef.context.coord = viewRef.rootNodes[0].getBoundingClientRect();
    }, 100);


    return viewRef;
  }

  // _createRowView(i: number): ComponentRef<MsTableRow<T>> {
  //   const context = new MsTableRowContext(this._items[i], i, this._items.length);
  //   const injector: Injector = this._createRowInjector(context);
  //   const componentFactory = this.componentFactoryResolver.resolveComponentFactory<MsTableRow<T>>(MsTableRow);
  //   const result = this.tableBodyContainer.createComponent<MsTableRow<T>>(componentFactory, i, injector);
  //   result.hostView.detectChanges();
  //   return result;
  // }
  //
  // _createRowInjector(context: MsTableRowContext<T>): Injector {
  //   return {
  //     get: (token: any, notFoundValue?: any): any => {
  //       const customTokens = new WeakMap<any, any>([
  //         [MsTableRowContext, context],
  //         [MsTableRowDef, this.tableRowDef]]);
  //
  //       const value = customTokens.get(token);
  //
  //       if (typeof value !== 'undefined') {
  //         return value;
  //       }
  //
  //       return this.injector.get<any>(token, notFoundValue);
  //     }
  //   };
  // }

  sort(compareFn?: (a: T, b: T) => number) {
    if (!compareFn) {
      return;
    }
    this._items = this._items.sort(compareFn);
    this.applyChanges();
  }

  filter(filterFn: (x: T) => boolean = () => true) {
    if (!filterFn) {
      return;
    }
    this._itemViews.forEach(viewRef => {
      if (!filterFn(viewRef.context.$implicit)) {
        viewRef.rootNodes[0].style.display = 'none';
        viewRef.context.visible = false;
      } else if (!viewRef.context.visible) {
        viewRef.rootNodes[0].style.display = 'table-row';
        // viewRef.rootNodes[0].animate([{opacity: 0}, {opacity: 1}], {fill: 'both', duration: 500});
        viewRef.context.visible = true;
        viewRef.context.coord.y = this.host.offsetHeight;

      }
      this.animateItem(viewRef);
    });
  }

  reverse() {
    this._items.reverse();
    this.applyChanges().then();
  }

  remove(...items: T[]) {
    this._items = this._items.filter(item => items.indexOf(item) < 0);
    this.applyChanges();
  }

  hideColumn(index: number) {
    this.tableHeadRows.toArray()[0].hideCell(index);
    this.tableRows.forEach(row => row.hideCell(index));
  }

  showColumn(index: number) {
    this.tableHeadRows.toArray()[0].showCell(index);
    this.tableRows.forEach(row => row.showCell(index));
  }

  toggleColumn(index: number) {
    const headerCell = this.tableHeadRow.headerCells.toArray()[index];
    if (headerCell.visible) {
      this.hideColumn(index);
    } else {
      this.showColumn(index);
    }
  }

  hideColumns(columnNames: string[]) {
    columnNames.forEach(name => this.hideColumnByName(name));
  }

  hideColumnByName(columnName: string) {
    const index = this.tableHeadRow.findColumnIndex(columnName);
    if (index > -1) {
      this.hideColumn(index);
    }
  }

  showColumnByName(columnName: string) {
    const index = this.tableHeadRow.findColumnIndex(columnName);
    if (index > -1) {
      this.showColumn(index);
    }
  }


  toggleColumnByName(columnName: string) {
    const index = this.tableHeadRow.findColumnIndex(columnName);
    if (index > -1) {
      this.toggleColumn(index);
    }
  }

  animateItem(item: EmbeddedViewRef<MsTableRowContext<T>>): Promise<void> {
    return new Promise<void>(resolve => {
      if (!item.context.coord) {
        resolve();
        return;
      }
      const y = item.context.coord.y - item.rootNodes[0].getBoundingClientRect().y;
      item.rootNodes[0].animate([
        {'transform': `translateY( ${y}px)`},
        {'transform': `none`}
      ], {fill: 'both', duration: 400})
        .onfinish = () => {
        resolve();
        item.context.coord = item.rootNodes[0].getBoundingClientRect();
      };
    });
  }

  resetSortColumn() {
    this.tableHeadRow.headerCells.forEach(cell => {
      cell.resetSortState();
    });
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}

