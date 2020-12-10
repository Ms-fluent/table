import {Component} from '@angular/core';
import {LogicPaginator, MsPaginatorItemsFn} from '../../components/paginator';
import {ELEMENT_DATA, PeriodicElement} from '../../element';

@Component({
  templateUrl: 'paginator.component.html'
})
export class PaginatorComponent {
  paginator: LogicPaginator<PeriodicElement>;

  itemsFn: MsPaginatorItemsFn<PeriodicElement> = (page: number, size: number) => {
    const start = page * size;
    let end = start + size;
    if (end >= ELEMENT_DATA.length) {
      end = ELEMENT_DATA.length;
    }

    return Promise.resolve(ELEMENT_DATA.slice(start, end));
  };

  constructor() {
    const paginator = new LogicPaginator();
    paginator.pageSize = 5;
    paginator.totalSize = 34;
    paginator.getItemFn = (page: number) => {
      const start = page * paginator.pageSize;
      let end = start + paginator.pageSize;
      if (end >= paginator.totalSize) {
        end = paginator.totalSize;
      }

      return ELEMENT_DATA.slice(start, end);
    };

    this.paginator = paginator;
  }
}
