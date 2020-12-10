import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {MS_TABLE_TOKEN, MsTableContract} from './table.interface';


let _uniqueId = 0;

@Component({
  selector: '[msTableHeadCell], [ms-tableHeadCell], ms-tableHeadCell, msTableHeadCell',
  exportAs: 'msTableHeadCell',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'table-head-cell.html',
  host: {
    'class': 'ms-tableHeadCell',
    'role': 'columnheader',
    '[attr.id]': 'id',
    '[attr.name]': 'name',
    '[attr.aria-sort]': 'ariaSort',
    '[attr.aria-colindex]': 'colIndex'
  },
})
export class MsTableHeadCell<T> {
  private _uniqueId: string = `ms-tableCell-${_uniqueId++}`;

  /** The unique ID for the table head cell. */
  public id: string = this._uniqueId;


  /** The name of the column. This attribute is used by table to show or hide column. */
  @Input()
  public name: string = this.id;

  /** The sorted order of the column. */
  private _ariaSort: 'none' | 'ascending' | 'descending' = 'none';
  get ariaSort(): 'none' | 'ascending' | 'descending' {
    return this._ariaSort;
  }

  private _colIndex: number;
  get colIndex(): number {
    return this._colIndex;
  }

  isSortedColumn: boolean = false;

  visible: boolean = true;

  @Input()
  get sortBy(): [string, 'string' | 'number' | 'date'] {
    return this._sortBy;
  }

  set sortBy(value: [string, 'string' | 'number' | 'date']) {
    if (value[1] === 'number') {
      this._sortFn = (a: T, b: T) => +a[value[0]] - +b[value[0]];
    } else if (value[1] === 'string') {
      this._sortFn = (a: T, b: T) => a[value[0]].toString().localeCompare(b[value[0]].toString());
    } else if (value[1] === 'date') {
      this._sortFn = (a: T, b: T) => new Date(a[value[0]]).getDate() - new Date(b[value[0]]).getDate();
    }
    this._sortBy = value;
  }

  private _sortBy: [string, 'string' | 'number' | 'date'];
  private _sortFn: (a: T, b: T) => number;

  @HostListener('click')
  sort() {
    if (this.sortBy == null) {
      return;
    }

    if (this.isSortedColumn) {
      this.table.reverse();
      this._ariaSort = this.ariaSort === 'ascending' ? 'descending' : 'ascending';
    } else {
      this.table.resetSortColumn();
      this.isSortedColumn = true;
      this.table.sort(this._sortFn);
      this._ariaSort = 'descending';
    }
    this.changeDetector.markForCheck();
  }

  resetSortState() {
    this.isSortedColumn = false;
    this._ariaSort = 'none';
    this.changeDetector.markForCheck();
  }

  constructor(@Inject(MS_TABLE_TOKEN) private table: MsTableContract<T>,
              private changeDetector: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>) {
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
