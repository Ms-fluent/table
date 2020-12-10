/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
  /** The current page index. */
  pageIndex: number;

  /*** Index of the page that was selected previously.*/
  previousPageIndex?: number;

  /** The current page size */
  pageSize: number;

  /** The current total number of items being paged */
  length: number;
}

export interface MatPaginatorDefaultOptions {
  /** Number of items to display on a page. By default set to 50. */
  pageSize?: number;
}



export class MsPaginatorState {
  pageCount: number;
  pageSize: number;
  totalSize: number;
  pages: number[]
}

export type MsPaginatorItemsFn<T> = (page: number, size: number) => Promise<T[]>
