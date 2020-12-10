export class LogicPaginator<T> {
  pageSize: number;

  totalSize: number;

  getItemFn: (page: number) => Array<T>;

  countPage(): number {
    return Math.ceil(this.totalSize / this.pageSize);
  }

  getPage(index: number): Page<T> {
    if(index > this.countPage()) {
      index = this.countPage();
    }
    const page = new Page<T>();
    page.start = index * this.pageSize;
    page.items = this.getItemFn(index);
    return page;
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 0; i < this.countPage(); i++) {
      pages.push(i);
    }
    return pages;
  }
}


export class Page<T> {
  items: Array<T>;
  start: number;

  get size(): number {
    return this.items.length;
  }

  get end(): number {
    return this.start + this.items.length;
  }
}
