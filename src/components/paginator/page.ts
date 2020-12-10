export class MsPage<T> {
  /** Items data injected in the page. */
  items: Array<T>;

  /** The current page index. */
  pageIndex: number;

  /*** Index of the page that was selected previously.*/
  previousPageIndex?: number;

  /** The current page size */
  pageSize: number;

  start: number;

  /** The current total number of items being paged */
  get length(): number {
    return this.items.length;
  }

  get end(): number {
    return this.start + this.items.length;
  }
}
