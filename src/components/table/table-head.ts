import {ChangeDetectionStrategy, Component, ContentChildren, Directive, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {MsTableHeadCell} from './table-head-cell';

@Directive({
  selector: '[ms-tableHeadDef], [msTableHeadDef]'
})
export class MsTableHeadDef {
  constructor(public template: TemplateRef<any>) {
  }
}


@Component({
  selector: '[msTableHead],  [ms-tableHead], msTableHead, ms-tableHead',
  exportAs: 'msTableHead',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <ng-content></ng-content>`,
  host: {
    'class': 'ms-tableHead'
  }
})
export class MsTableHead<T> {
  @ContentChildren(MsTableHeadCell)
  headerCells: QueryList<MsTableHeadCell<T>>;


  hideCell(index: number) {
    const cells = this.headerCells.toArray();
    if (index < 0 || index > cells.length - 1) {
      throw new Error('Cell index of range');
    }

    cells[index].host.style.display = 'none';
  }

  showCell(index: number) {
    const cells = this.headerCells.toArray();
    if (index < 0 || index > cells.length - 1) {
      throw new Error('Cell index of range');
    }

    cells[index].host.style.display = 'table-cell';
  }
}
