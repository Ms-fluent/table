import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[ms-tableRowDef], [MsTableRowDef]'
})
export class MsTableRowDef<T> {
  @Input('ms-tableRowDefOf')
  data: Array<T>;

  constructor(public template: TemplateRef<MsTableRowContext<T>>) {
  }

}

export class MsTableRowContext<T> {
  odd: boolean;
  even: boolean;
  first: boolean;
  last: boolean;

  coord: DOMRect;
  visible: boolean = true;

  constructor(public $implicit: T,
              public index: number, total: number) {
    this.setData(index, total);
  }

  setData(index: number, total: number) {
    this.index = index;
    this.odd = index % 2 === 1;
    this.even = !this.odd;
    this.first = index === 0;
    this.last = index === total - 1;
  }
}
