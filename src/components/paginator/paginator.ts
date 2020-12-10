import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsPage} from './page';
import {MsPaginatorItemsFn, MsPaginatorState} from './paginator-options';
import {MsPaginatorPageDef} from './page-def';

@Component({
  templateUrl: 'paginator.html',
  selector: 'ms-paginator, msPaginator',
  exportAs: 'msPaginator',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-paginator'
  }
})
export class MsPaginator<T> implements AfterViewInit {
  private _initialized: boolean;

  @Input()
  get totalSize(): number {
    return this._totalSize;
  }

  set totalSize(value: number) {
    if (this._initialized) {
      this.changeTotalSize(value);
    }
    this._totalSize = value;
  }

  private _totalSize: number;


  @Input()
  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    if (this._initialized) {
      this.changePageSize(value);
    }
    this._pageSize = value;
  }

  private _pageSize: number;

  @Input()
  get currentPageIndex(): number {
    return this._currentPageIndex;
  }

  set currentPageIndex(value: number) {
    if (this._initialized) {
      this.changeCurrentPageIndex(value);
    }
    this._currentPageIndex = value;
  }

  private _currentPageIndex: number = 0;

  private _currentPage: MsPage<T>;

  get currentPage(): MsPage<T> {
    return this._currentPage;
  }

  /** Function to get data items. */
  @Input()
  get itemsFn(): MsPaginatorItemsFn<T> {
    return this._itemsFn;
  }

  set itemsFn(value: MsPaginatorItemsFn<T>) {
    this._itemsFn = value;
  }


  private _itemsFn: MsPaginatorItemsFn<T>;


  @Output()
  public readonly pageChange: EventEmitter<MsPage<T>> = new EventEmitter<MsPage<T>>();

  @Output()
  public readonly stateChange: EventEmitter<MsPaginatorState> = new EventEmitter<MsPaginatorState>();

  @ViewChild('pageContainer', {read: ViewContainerRef})
  pageContainer: ViewContainerRef;

  @ContentChild(MsPaginatorPageDef)
  pageDef: MsPaginatorPageDef<T>;

  constructor(private _changeDetector: ChangeDetectorRef) {
  }

  async ngAfterViewInit() {
    this.pageContainer.clear();
    const data = await this.itemsFn(this._currentPageIndex, this.pageSize);
    const page = new MsPage();
    page.items = data;
    page.start = 0;
    page.pageSize = this.pageSize;
    page.pageIndex = 0;

    this.pageContainer.createEmbeddedView(this.pageDef.template, page);
  }

  nextPage() {
  }

  previousPage() {
  }

  firstPage() {
  }

  lastPage() {
  }

  changeCurrentPageIndex(index: number) {
  }

  get hasPreviousPage(): boolean {
    return this._currentPageIndex >= 1 && this.pageSize !== 0;
  }

  get hasNextPage(): boolean {
    const maxPageIndex = this.pageCount - 1;
    return this._currentPageIndex < maxPageIndex && this.pageSize !== 0;
  }

  get pageCount(): number {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.totalSize / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 0; i < this.pageCount; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePageSize(size: number) {
  }

  changeTotalSize(size: number) {
  }

}
